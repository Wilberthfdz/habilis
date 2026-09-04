// Pruebas de las reglas de seguridad de Firestore contra el emulador real.
// Cada caso corresponde a un hallazgo del informe de auditoría.

import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment, assertFails, assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, addDoc,
  query, where,
} from "firebase/firestore";

const env = await initializeTestEnvironment({
  projectId: "demo-habilis",
  firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8080 },
});

const ADMIN = { email: "wilberthfdz@gmail.com", email_verified: true };
const ADMIN_SIN_VERIFICAR = { email: "wilberthfdz@gmail.com", email_verified: false };

const tec  = env.authenticatedContext("tecnico1").firestore();
const otro = env.authenticatedContext("intruso").firestore();
const cli  = env.authenticatedContext("cliente1").firestore();
const anon = env.unauthenticatedContext().firestore();
const admin = env.authenticatedContext("adminUid", ADMIN).firestore();
const adminFalso = env.authenticatedContext("adminUid", ADMIN_SIN_VERIFICAR).firestore();

// Datos base, escritos saltándose las reglas.
await env.withSecurityRulesDisabled(async (ctx) => {
  const d = ctx.firestore();
  await setDoc(doc(d, "tecnicos/tecnico1"), { nombre: "Rafa", plan: "gratis", email: "rafa@x.com", verificado: false, rating: 0, totalTrabajos: 0 });
  await setDoc(doc(d, "trabajos/t1"), { tecnicoId: "tecnico1", titulo: "Instalación", aprobadoIA: true, calidadIA: 8 });
  await setDoc(doc(d, "cotizaciones/c1"), { tecnicoId: "tecnico1", clienteRfc: "XAXX010101000", total: 5000, estado: "enviada" });
  await setDoc(doc(d, "cotizaciones/c2"), { tecnicoId: "tecnico1", total: 900, estado: "enviada" });
  await setDoc(doc(d, "servicios/s1"), { userId: "cliente1", activoId: "a1", costo: 1200 });
  await setDoc(doc(d, "solicitudes_chat/ch1"), { clienteId: "cliente1", tecnicoId: "tecnico1", estado: "pendiente" });
  await setDoc(doc(d, "solicitudes_chat/ch1/mensajes/m1"), { autorId: "cliente1", texto: "hola", tipo: "mensaje" });
  await setDoc(doc(d, "solicitudes/sol1"), { userId: "cliente1", descripcion: "fuga en cocina", ciudad: "Cancún" });
  await setDoc(doc(d, "planes_care/p1"), { clienteId: "cliente1", estado: "activo" });
  // Para el tope del plan gratuito: uno al límite y otro Pro.
  await setDoc(doc(d, "tecnicos/tope"), { nombre: "Tope", plan: "gratis", trabajosCreados: 5 });
  await setDoc(doc(d, "tecnicos/proSinTope"), { nombre: "Pro", plan: "pro", trabajosCreados: 40 });
});

const casos = [];
const probar = (nombre, promesa) => casos.push([nombre, promesa]);

// ── B1 · Cotizaciones: enlace sí, enumeración no ────────────────────────
probar("cotización: abrir por enlace directo funciona (sin sesión)",
  assertSucceeds(getDoc(doc(anon, "cotizaciones/c1"))));
probar("cotización: NO se puede listar la colección (fuga de RFC y cartera)",
  assertFails(getDocs(collection(anon, "cotizaciones"))));
probar("cotización: el técnico lista las suyas filtrando por dueño (como hace la app)",
  assertSucceeds(getDocs(query(collection(tec, "cotizaciones"), where("tecnicoId", "==", "tecnico1")))));
probar("cotización: un técnico NO puede listar las de otro",
  assertFails(getDocs(query(collection(otro, "cotizaciones"), where("tecnicoId", "==", "tecnico1")))));
probar("cotización: el cliente sin sesión puede aceptarla",
  assertSucceeds(updateDoc(doc(anon, "cotizaciones/c2"), { estado: "aceptada" })));
probar("cotización: nadie puede reescribir el precio",
  assertFails(updateDoc(doc(anon, "cotizaciones/c1"), { total: 1 })));

// ── B1 · Chat privado ───────────────────────────────────────────────────
probar("chat: un tercero NO puede leer la conversación",
  assertFails(getDoc(doc(otro, "solicitudes_chat/ch1"))));
probar("chat: el cliente sí lee la suya",
  assertSucceeds(getDoc(doc(cli, "solicitudes_chat/ch1"))));
probar("chat: el técnico sí lee la suya",
  assertSucceeds(getDoc(doc(tec, "solicitudes_chat/ch1"))));
probar("chat: un tercero NO puede leer los mensajes",
  assertFails(getDocs(collection(otro, "solicitudes_chat/ch1/mensajes"))));
probar("chat: la parte sí lee los mensajes",
  assertSucceeds(getDocs(collection(cli, "solicitudes_chat/ch1/mensajes"))));
probar("chat: un tercero NO puede mover la solicitud a aceptado",
  assertFails(updateDoc(doc(otro, "solicitudes_chat/ch1"), { estado: "aceptado" })));
probar("chat: la parte sí puede cambiar el estado",
  assertSucceeds(updateDoc(doc(tec, "solicitudes_chat/ch1"), { estado: "aceptado" })));
probar("chat: NO se puede firmar un mensaje como otra persona",
  assertFails(addDoc(collection(cli, "solicitudes_chat/ch1/mensajes"), { autorId: "tecnico1", texto: "deposita aquí", tipo: "mensaje" })));
probar("chat: un tercero NO puede escribir en la conversación",
  assertFails(addDoc(collection(otro, "solicitudes_chat/ch1/mensajes"), { autorId: "intruso", texto: "spam", tipo: "mensaje" })));
probar("chat: la parte sí puede escribir con su propio autor",
  assertSucceeds(addDoc(collection(cli, "solicitudes_chat/ch1/mensajes"), { autorId: "cliente1", texto: "buenas", tipo: "mensaje" })));
probar("chat: el aviso de sistema sigue funcionando para las partes",
  assertSucceeds(addDoc(collection(tec, "solicitudes_chat/ch1/mensajes"), { autorId: "sistema", texto: "aceptada", tipo: "sistema" })));

// ── B1 · Habilis Care ───────────────────────────────────────────────────
probar("care: un tercero NO puede leer el historial de servicio ajeno",
  assertFails(getDoc(doc(otro, "servicios/s1"))));
probar("care: un tercero NO puede EDITAR el historial ajeno",
  assertFails(updateDoc(doc(otro, "servicios/s1"), { costo: 0 })));
probar("care: el dueño sí lee el suyo",
  assertSucceeds(getDoc(doc(cli, "servicios/s1"))));
probar("care: no se puede crear un servicio a nombre de otro",
  assertFails(addDoc(collection(otro, "servicios"), { userId: "cliente1", activoId: "a1" })));

// ── B3 · Auto-ascenso a Pro y a Verificado ──────────────────────────────
probar("alta: NO se puede nacer con plan pro",
  assertFails(setDoc(doc(env.authenticatedContext("nuevo1").firestore(), "tecnicos/nuevo1"), { nombre: "X", plan: "pro" })));
probar("alta: NO se puede nacer verificado",
  assertFails(setDoc(doc(env.authenticatedContext("nuevo2").firestore(), "tecnicos/nuevo2"), { nombre: "X", plan: "gratis", verificado: true })));
probar("alta: NO se puede nacer con rating inflado",
  assertFails(setDoc(doc(env.authenticatedContext("nuevo3").firestore(), "tecnicos/nuevo3"), { nombre: "X", plan: "gratis", rating: 5 })));
probar("alta: un registro legítimo sí funciona",
  assertSucceeds(setDoc(doc(env.authenticatedContext("nuevo4").firestore(), "tecnicos/nuevo4"), { nombre: "X", oficio: "Electricista", ciudad: "Cancún", plan: "gratis" })));
probar("perfil: el técnico NO puede ascenderse después",
  assertFails(updateDoc(doc(tec, "tecnicos/tecnico1"), { plan: "pro" })));
probar("perfil: el técnico sí puede editar su bio",
  assertSucceeds(updateDoc(doc(tec, "tecnicos/tecnico1"), { bio: "20 años de experiencia" })));

// ── B4 · Moderación y reputación falsificables ──────────────────────────
probar("trabajo: el dueño NO puede aprobarse la moderación",
  assertFails(updateDoc(doc(tec, "trabajos/t1"), { aprobadoIA: true, calidadIA: 10 })));
probar("trabajo: el dueño sí puede corregir su descripción",
  assertSucceeds(updateDoc(doc(tec, "trabajos/t1"), { descripcion: "corregida" })));
probar("trabajo: un tercero no puede tocarlo",
  assertFails(updateDoc(doc(otro, "trabajos/t1"), { descripcion: "hackeado" })));

// ── B6 · Tope de trabajos del plan gratuito ─────────────────────────────
const tope = env.authenticatedContext("tope").firestore();
const proSinTope = env.authenticatedContext("proSinTope").firestore();
probar("plan gratis: el técnico dentro del tope sí puede documentar",
  assertSucceeds(addDoc(collection(tec, "trabajos"), { tecnicoId: "tecnico1", titulo: "Nuevo" })));
probar("plan gratis: al llegar a 5 trabajos ya no puede documentar más",
  assertFails(addDoc(collection(tope, "trabajos"), { tecnicoId: "tope", titulo: "Sexto" })));
probar("plan Pro: documenta sin tope",
  assertSucceeds(addDoc(collection(proSinTope, "trabajos"), { tecnicoId: "proSinTope", titulo: "Cuarenta y uno" })));

// ── B4 · Validaciones sociales ──────────────────────────────────────────
probar("validación: NO se puede votar a nombre de otro",
  assertFails(setDoc(doc(otro, "validaciones/t1_cliente1_util"), { trabajoId: "t1", validadorId: "cliente1", tipo: "util" })));
probar("validación: NO se puede usar un ID que no corresponde",
  assertFails(setDoc(doc(cli, "validaciones/inventado"), { trabajoId: "t1", validadorId: "cliente1", tipo: "util" })));
probar("validación: NO se admite un tipo inventado",
  assertFails(setDoc(doc(cli, "validaciones/t1_cliente1_super"), { trabajoId: "t1", validadorId: "cliente1", tipo: "super" })));
probar("validación: el técnico NO puede votarse su propio trabajo",
  assertFails(setDoc(doc(tec, "validaciones/t1_tecnico1_util"), { trabajoId: "t1", validadorId: "tecnico1", tipo: "util" })));
probar("validación: un voto legítimo sí pasa",
  assertSucceeds(setDoc(doc(cli, "validaciones/t1_cliente1_util"), { trabajoId: "t1", validadorId: "cliente1", tipo: "util" })));

// ── Solicitudes y planes ────────────────────────────────────────────────
probar("solicitud: sin sesión NO se leen los problemas del domicilio",
  assertFails(getDoc(doc(anon, "solicitudes/sol1"))));
probar("solicitud: con sesión sí se lee",
  assertSucceeds(getDoc(doc(cli, "solicitudes/sol1"))));
probar("care: el cliente NO puede cambiar el estado de su plan de pago",
  assertFails(updateDoc(doc(cli, "planes_care/p1"), { estado: "pagado" })));

// ── isAdmin con correo sin verificar ────────────────────────────────────
probar("admin: el correo sin verificar NO otorga privilegios",
  assertFails(getDocs(collection(adminFalso, "promos"))));
probar("admin: con correo verificado sí",
  assertSucceeds(getDocs(collection(admin, "promos"))));

// ── Dinero: intocable desde el navegador ────────────────────────────────
probar("pagos: nadie los crea desde el cliente",
  assertFails(addDoc(collection(tec, "pagos"), { userId: "tecnico1", monto: 0 })));
probar("facturas: nadie las escribe desde el cliente",
  assertFails(addDoc(collection(tec, "facturas"), { userId: "tecnico1" })));
probar("promos: un usuario normal NO puede listar los códigos",
  assertFails(getDocs(collection(tec, "promos"))));

// ── Ejecución ───────────────────────────────────────────────────────────
let ok = 0, fallo = 0;
for (const [nombre, promesa] of casos) {
  try { await promesa; console.log(`  ✅ ${nombre}`); ok++; }
  catch (e) { console.log(`  ❌ ${nombre}\n       ${String(e.message).split("\n")[0].slice(0, 160)}`); fallo++; }
}
console.log(`\n${ok} correctas · ${fallo} fallidas · ${casos.length} casos`);
await env.cleanup();
process.exit(fallo === 0 ? 0 : 1);
