// ─── FIREBASE SERVICE — Base de datos, auth y storage ────────────────────
import { initializeApp }                   from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, OAuthProvider, signInWithPopup, sendPasswordResetEmail, sendEmailVerification, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp, increment, runTransaction } from "firebase/firestore";
// Storage SDK removed — profile photos use base64-in-Firestore (no Blaze plan needed)
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { firebaseConfig, APPCHECK_SITE_KEY }   from "./config.js";

// Inicializar Firebase (Google Cloud — satisface requisito de competencia)
const app     = initializeApp(firebaseConfig);

// App Check: acredita que quien llama es esta app y no un script ajeno.
// Sin él, cualquiera con la URL de `geminiProxy` puede crear cuentas y
// quemar crédito de Gemini. Solo se activa si hay clave configurada, así
// que mientras esté vacía la app se comporta igual que siempre.
if (APPCHECK_SITE_KEY) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(APPCHECK_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (e) {
    // Nunca dejar la app inservible por un fallo de App Check.
    console.error("App Check no pudo inicializarse:", e.message);
  }
}
const auth    = getAuth(app);
const db      = getFirestore(app);

// ── AUTH ────────────────────────────────────────────────────────────────
export const registrarUsuario = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const iniciarSesion = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const cerrarSesion = () => signOut(auth);

export const enviarResetPassword = (email) => sendPasswordResetEmail(auth, email);

export const enviarVerificacionEmail = (user) => sendEmailVerification(user);

export const actualizarNombreAuth = (user, nombre) => updateProfile(user, { displayName: nombre });

export const onAuth = (callback) => onAuthStateChanged(auth, callback);

// Google Sign-In — prompt:"select_account" forces account picker every time
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const loginConGoogle = () => signInWithPopup(auth, googleProvider);

// Apple Sign-In — mismo patrón que Google: el intercambio de tokens lo hace
// Firebase por detrás, este código nunca ve credenciales. La configuración
// real (Services ID, Team ID, Key ID, .p8 de Apple Developer) se da de alta
// en Firebase Console → Authentication → Sign-in method → Apple, no aquí.
const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");
export const loginConApple = () => signInWithPopup(auth, appleProvider);

// ── TÉCNICOS ────────────────────────────────────────────────────────────
export async function crearPerfilTecnico(uid, datos) {
  await setDoc(doc(db, "tecnicos", uid), {
    ...datos,
    uid,
    plan: "gratis",         // gratis | pro
    verificado: false,
    rating: 0,
    totalReviews: 0,
    totalTrabajos: 0,
    disponible: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Facturas del propio técnico. Las reglas ya permiten que el dueño lea las
// suyas; sin esto solo el admin podía verlas.
export async function obtenerFacturas(uid) {
  const q = query(collection(db, "facturas"), where("userId", "==", uid), orderBy("fecha", "desc"), limit(24));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function obtenerTecnico(uid) {
  const snap = await getDoc(doc(db, "tecnicos", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function crearPerfilCliente(uid, datos) {
  await setDoc(doc(db, "clientes", uid), {
    ...datos,
    uid,
    tipo: "cliente",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function actualizarCliente(uid, datos) {
  await updateDoc(doc(db, "clientes", uid), { ...datos, updatedAt: serverTimestamp() });
}

export async function obtenerCliente(uid) {
  const snap = await getDoc(doc(db, "clientes", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function actualizarTecnico(uid, datos) {
  await updateDoc(doc(db, "tecnicos", uid), {
    ...datos,
    updatedAt: serverTimestamp(),
  });
}

// Pro y Empresa comparten los beneficios de visibilidad — solo Empresa
// además puede dar de alta empleados (ver crearEmpleado).
export const esPlanPagante = plan => plan === "pro" || plan === "empresa";

export async function buscarTecnicos({ limite = 100 } = {}) {
  // No oficio/ciudad filters here — they require composite indexes that may
  // not exist. Buscar.jsx applies case-insensitive client-side filtering.
  const q = query(collection(db, "tecnicos"), where("disponible", "==", true), limit(limite));
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // Sort Pro/Empresa first, then by rating descending, client-side
  return docs.sort((a, b) => {
    if (esPlanPagante(a.plan) && !esPlanPagante(b.plan)) return -1;
    if (esPlanPagante(b.plan) && !esPlanPagante(a.plan)) return  1;
    return (b.rating || 0) - (a.rating || 0);
  });
}

// ── EMPLEADOS (cuentas Empresa) ──────────────────────────────────────────
// Un perfil con plan "empresa" puede dar de alta perfiles de empleados como
// técnicos propios: comparten el mismo esquema y aparecen en las mismas
// búsquedas/matching, solo llevan `empresaId` apuntando al dueño que paga.
// Crear uno nuevo pasa por la Cloud Function `crearEmpleado` (lib/gemini.js)
// — ahí se hace cumplir el tope de 10 por cuenta, algo que las reglas de
// Firestore no pueden garantizar de forma confiable.
export async function obtenerEmpleados(empresaId) {
  const q = query(collection(db, "tecnicos"), where("empresaId", "==", empresaId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function actualizarEmpleado(id, datos) {
  await updateDoc(doc(db, "tecnicos", id), { ...datos, updatedAt: serverTimestamp() });
}

export async function eliminarEmpleado(id) {
  await deleteDoc(doc(db, "tecnicos", id));
}

// ── TRABAJOS (Expedientes) ───────────────────────────────────────────────
export async function crearTrabajo(datos) {
  const ref = await addDoc(collection(db, "trabajos"), {
    ...datos,
    estado: "pendiente",    // pendiente|aceptado|proceso|terminado|validado|incidencia
    evidencias: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function actualizarTrabajo(trabajoId, datos) {
  await updateDoc(doc(db, "trabajos", trabajoId), {
    ...datos,
    updatedAt: serverTimestamp(),
  });
}

export async function obtenerTrabajosDelTecnico(tecnicoId) {
  const q = query(
    collection(db, "trabajos"),
    where("tecnicoId", "==", tecnicoId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── SOLICITUDES ─────────────────────────────────────────────────────────
export async function crearSolicitud(datos) {
  const ref = await addDoc(collection(db, "solicitudes"), {
    ...datos,
    estado: "abierta",
    respuestas: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function obtenerSolicitudesRecientes(ciudad) {
  const q = query(
    collection(db, "solicitudes"),
    where("ciudad", "==", ciudad),
    where("estado", "==", "abierta"),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function marcarRespuestaSolicitud(solicitudId) {
  await updateDoc(doc(db, "solicitudes", solicitudId), { respuestas: increment(1) });
}

// ── FOTO DE PERFIL (base64 → Firestore, no Storage needed) ──────────────
// Accepts a Blob already compressed by the caller (canvas, max 200×200px).
// Converts to base64 data-URL, validates size < 150 KB, then writes to Firestore.
export async function subirFotoPerfil(uid, blob) {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(blob);
  });

  // base64 string length ≈ 1.37× raw bytes; 150 KB raw → ~205 KB string
  if (base64.length > 205 * 1024) {
    throw new Error("La foto sigue siendo muy grande. Usa una imagen más pequeña.");
  }

  await updateDoc(doc(db, "tecnicos", uid), { fotoUrl: base64, updatedAt: serverTimestamp() });
  return base64;
}

// ── HABILIS CARE — ACTIVOS ───────────────────────────────────────────────
export async function crearActivo(userId, datos) {
  const ref = await addDoc(collection(db, "activos"), {
    ...datos,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function obtenerActivos(userId) {
  // Simple single-field query — sorts client-side to avoid composite index
  const q    = query(collection(db, "activos"), where("userId", "==", userId));
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return docs.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
}

export async function actualizarActivo(activoId, datos) {
  await updateDoc(doc(db, "activos", activoId), { ...datos, updatedAt: serverTimestamp() });
}

export async function eliminarActivo(activoId) {
  await updateDoc(doc(db, "activos", activoId), { eliminado: true, updatedAt: serverTimestamp() });
}

// ── HABILIS CARE — SERVICIOS ─────────────────────────────────────────────
export async function crearServicio(datos) {
  const ref = await addDoc(collection(db, "servicios"), {
    ...datos,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function obtenerServicios(activoId) {
  const q    = query(collection(db, "servicios"), where("activoId", "==", activoId), limit(20));
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return docs.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
}

// ── HABILIS CARE — PLANES ────────────────────────────────────────────────
export async function crearPlanCare(datos) {
  const r = await addDoc(collection(db, "planes_care"), {
    ...datos, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return r.id;
}
export async function obtenerPlanesCare(clienteId) {
  const q = query(collection(db, "planes_care"), where("clienteId", "==", clienteId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function actualizarPlanCare(planId, datos) {
  await updateDoc(doc(db, "planes_care", planId), { ...datos, updatedAt: serverTimestamp() });
}

// ── COTIZACIONES ─────────────────────────────────────────────────────────
// Transacción, no get()+set(): dos cotizaciones creadas casi al mismo tiempo
// podían leer el mismo contador y salir con el mismo folio.
export async function obtenerSiguienteFolio(tecnicoId) {
  const year = new Date().getFullYear();
  const ref  = doc(db, "cotizaciones_folio", tecnicoId);
  const num = await runTransaction(db, async tx => {
    const snap = await tx.get(ref);
    let n = 1;
    if (snap.exists()) {
      const d = snap.data();
      n = d.year === year ? (d.contador || 0) + 1 : 1;
    }
    tx.set(ref, { contador: n, year });
    return n;
  });
  return `HAB-${year}-${String(num).padStart(3, "0")}`;
}

export async function crearCotizacion(datos) {
  const r = await addDoc(collection(db, "cotizaciones"), {
    ...datos, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return r.id;
}
export async function obtenerCotizaciones(tecnicoId) {
  const q = query(collection(db, "cotizaciones"), where("tecnicoId", "==", tecnicoId));
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return docs.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
}
export async function obtenerCotizacion(cotId) {
  const snap = await getDoc(doc(db, "cotizaciones", cotId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
export async function actualizarCotizacion(cotId, datos) {
  await updateDoc(doc(db, "cotizaciones", cotId), { ...datos, updatedAt: serverTimestamp() });
}
export async function eliminarCotizacion(cotId) {
  await updateDoc(doc(db, "cotizaciones", cotId), { eliminada: true, updatedAt: serverTimestamp() });
}

// ── CLIENTES DEL TÉCNICO ─────────────────────────────────────────────────
export async function guardarClienteTecnico(tecnicoId, datos) {
  // Upsert by email
  const q = query(collection(db, "clientes_tecnico"),
    where("tecnicoId", "==", tecnicoId), where("email", "==", datos.email));
  const snap = await getDocs(q);
  if (!snap.empty) {
    await updateDoc(snap.docs[0].ref, { ...datos, updatedAt: serverTimestamp() });
    return snap.docs[0].id;
  }
  const r = await addDoc(collection(db, "clientes_tecnico"), {
    ...datos, tecnicoId, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return r.id;
}
export async function obtenerClientesTecnico(tecnicoId) {
  const q = query(collection(db, "clientes_tecnico"), where("tecnicoId", "==", tecnicoId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── CATÁLOGO DE PRODUCTOS ────────────────────────────────────────────────
export async function guardarProductoTecnico(tecnicoId, datos) {
  // Upsert by description
  const q = query(collection(db, "productos_tecnico"),
    where("tecnicoId", "==", tecnicoId), where("descripcion", "==", datos.descripcion));
  const snap = await getDocs(q);
  if (!snap.empty) {
    await updateDoc(snap.docs[0].ref, { ...datos, updatedAt: serverTimestamp() });
    return snap.docs[0].id;
  }
  const r = await addDoc(collection(db, "productos_tecnico"), {
    ...datos, tecnicoId, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return r.id;
}
export async function obtenerProductosTecnico(tecnicoId) {
  const q = query(collection(db, "productos_tecnico"), where("tecnicoId", "==", tecnicoId), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// NOTA DE SEGURIDAD: la vieja `activarPlanPro()` escribía plan:"pro" directo
// desde el cliente sin verificar ningún pago (era un stub para Conekta que
// nunca se completó, y no tenía ningún caller). Se eliminó — ver
// SECURITY_AUDIT.md #1. El único camino real para volverse Pro ahora es
// `iniciarSuscripcionPro()` (src/lib/gemini.js) → Mercado Pago → webhook
// server-side (functions/index.js: webhookMP), que es el único que puede
// escribir `plan` (las reglas de Firestore ya bloquean ese campo desde el
// cliente).

// ── SOLICITUDES_CHAT ─────────────────────────────────────────────────────
export async function crearSolicitudChat(datos) {
  const r = await addDoc(collection(db, "solicitudes_chat"), {
    ...datos, estado:"pendiente", createdAt:serverTimestamp(), updatedAt:serverTimestamp(),
  });
  return r.id;
}
export async function obtenerSolicitudChat(solicitudId) {
  const snap = await getDoc(doc(db, "solicitudes_chat", solicitudId));
  return snap.exists() ? { id:snap.id, ...snap.data() } : null;
}
export async function actualizarSolicitudChat(solicitudId, datos) {
  await updateDoc(doc(db, "solicitudes_chat", solicitudId), { ...datos, updatedAt:serverTimestamp() });
}
export async function obtenerSolicitudesChat(tecnicoId, estado) {
  const conds = [where("tecnicoId","==",tecnicoId)];
  if (estado) conds.push(where("estado","==",estado));
  const snap = await getDocs(query(collection(db,"solicitudes_chat"), ...conds));
  const docs = snap.docs.map(d => ({ id:d.id, ...d.data() }));
  return docs.sort((a,b) => (b.createdAt?.toMillis?.()|| 0) - (a.createdAt?.toMillis?.()|| 0));
}
export async function obtenerSolicitudesCliente(clienteId) {
  const snap = await getDocs(query(collection(db,"solicitudes_chat"), where("clienteId","==",clienteId)));
  const docs = snap.docs.map(d => ({ id:d.id, ...d.data() }));
  return docs.sort((a,b) => (b.createdAt?.toMillis?.()|| 0) - (a.createdAt?.toMillis?.()|| 0));
}
export async function enviarMensajeChat(solicitudId, mensaje) {
  return addDoc(collection(db,"solicitudes_chat",solicitudId,"mensajes"), {
    ...mensaje, timestamp:serverTimestamp(),
  });
}

// ── VALIDACIONES ─────────────────────────────────────────────────────────
export async function validarTrabajo(trabajoId, validadorId, tipo) {
  const ref = doc(db, "validaciones", `${trabajoId}_${validadorId}_${tipo}`);
  const snap = await getDoc(ref);
  if (snap.exists()) return false;
  await setDoc(ref, { trabajoId, validadorId, tipo, createdAt:serverTimestamp() });
  return true;
}
export async function obtenerValidaciones(trabajoId) {
  const snap = await getDocs(query(collection(db,"validaciones"), where("trabajoId","==",trabajoId)));
  return snap.docs.map(d => d.data());
}

// ── RED DE COLABORADORES ─────────────────────────────────────────────────
export async function agregarColaborador(userId, tecnicoData) {
  await setDoc(
    doc(db,"red_colaboradores",userId,"lista",tecnicoData.tecnicoId),
    { ...tecnicoData, addedAt:serverTimestamp() },
    { merge:true }
  );
}
export async function obtenerColaboradores(userId) {
  const snap = await getDocs(collection(db,"red_colaboradores",userId,"lista"));
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}
export async function estaEnRed(userId, tecnicoId) {
  const snap = await getDoc(doc(db,"red_colaboradores",userId,"lista",tecnicoId));
  return snap.exists();
}

// ── NOTIFICACIONES (escritas por los agentes de IA y el admin) ───────────
export async function obtenerNotificaciones(userId) {
  // Sin orderBy para no requerir índice compuesto — se ordena en cliente
  const q = query(collection(db, "notificaciones"), where("userId", "==", userId), limit(50));
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return docs.sort((a, b) => (b.fecha?.toMillis?.() || 0) - (a.fecha?.toMillis?.() || 0));
}

export async function marcarNotificacionLeida(notifId) {
  await updateDoc(doc(db, "notificaciones", notifId), { leida: true });
}

export async function marcarTodasLeidas(notifs) {
  await Promise.all(notifs.filter(n => !n.leida).map(n => marcarNotificacionLeida(n.id)));
}

export { auth, db, app };
