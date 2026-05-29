// ─── FIREBASE SERVICE — Base de datos, auth y storage ────────────────────
import { initializeApp }                   from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
// Storage SDK removed — profile photos use base64-in-Firestore (no Blaze plan needed)
import { firebaseConfig }                  from "./config.js";

// Inicializar Firebase (Google Cloud — satisface requisito de competencia)
const app     = initializeApp(firebaseConfig);
const auth    = getAuth(app);
const db      = getFirestore(app);

// ── AUTH ────────────────────────────────────────────────────────────────
export const registrarUsuario = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const iniciarSesion = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const cerrarSesion = () => signOut(auth);

export const onAuth = (callback) => onAuthStateChanged(auth, callback);

// Google Sign-In — prompt:"select_account" forces account picker every time
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const loginConGoogle = () => signInWithPopup(auth, googleProvider);

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

export async function obtenerTecnico(uid) {
  const snap = await getDoc(doc(db, "tecnicos", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function actualizarTecnico(uid, datos) {
  await updateDoc(doc(db, "tecnicos", uid), {
    ...datos,
    updatedAt: serverTimestamp(),
  });
}

export async function buscarTecnicos({ limite = 100 } = {}) {
  // No oficio/ciudad filters here — they require composite indexes that may
  // not exist. Buscar.jsx applies case-insensitive client-side filtering.
  const q = query(collection(db, "tecnicos"), where("disponible", "==", true), limit(limite));
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // Sort Pro first, then by rating descending, client-side
  return docs.sort((a, b) => {
    if (a.plan === "pro" && b.plan !== "pro") return -1;
    if (b.plan === "pro" && a.plan !== "pro") return  1;
    return (b.rating || 0) - (a.rating || 0);
  });
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
export async function obtenerSiguienteFolio(tecnicoId) {
  const year = new Date().getFullYear();
  const ref  = doc(db, "cotizaciones_folio", tecnicoId);
  const snap = await getDoc(ref);
  let num = 1;
  if (snap.exists()) {
    const d = snap.data();
    num = d.year === year ? (d.contador || 0) + 1 : 1;
  }
  await setDoc(ref, { contador: num, year });
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

// ── SUSCRIPCIONES ────────────────────────────────────────────────────────
export async function activarPlanPro(uid, datosConekta) {
  // Aquí va la integración con Conekta para cobrar $100 MXN/mes
  // Por ahora registra la intención de pago
  await updateDoc(doc(db, "tecnicos", uid), {
    plan: "pro",
    planActivadoEn: serverTimestamp(),
    planVenceEn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    conektaCustomerId: datosConekta?.customerId || null,
  });
}

export { auth, db, app };
