// ─── FIREBASE SERVICE — Base de datos, auth y storage ────────────────────
import { initializeApp }                   from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseConfig }                  from "./config.js";

// Inicializar Firebase (Google Cloud — satisface requisito de competencia)
const app     = initializeApp(firebaseConfig);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

// ── AUTH ────────────────────────────────────────────────────────────────
export const registrarUsuario = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const iniciarSesion = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const cerrarSesion = () => signOut(auth);

export const onAuth = (callback) => onAuthStateChanged(auth, callback);

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

export async function buscarTecnicos({ oficio, ciudad, soloVerificados, soloPro, limite = 20 } = {}) {
  let q = collection(db, "tecnicos");
  const condiciones = [where("disponible", "==", true)];
  if (oficio)          condiciones.push(where("oficio", "==", oficio));
  if (ciudad)          condiciones.push(where("ciudad", "==", ciudad));
  if (soloVerificados) condiciones.push(where("verificado", "==", true));
  if (soloPro)         condiciones.push(where("plan", "==", "pro"));
  q = query(q, ...condiciones, orderBy("rating", "desc"), limit(limite));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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

// ── STORAGE (fotos de evidencia) ─────────────────────────────────────────
export async function subirFoto(trabajoId, archivo, etiqueta = "evidencia") {
  const storageRef = ref(storage, `trabajos/${trabajoId}/${etiqueta}_${Date.now()}`);
  const snap = await uploadBytes(storageRef, archivo);
  const url  = await getDownloadURL(snap.ref);
  return url;
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

export { auth, db, storage };
