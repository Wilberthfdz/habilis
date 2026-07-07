// ─── SEED DE DATOS DEMO PARA VIDEO ─────────────────────────────────────────
// Crea técnicos + trabajos documentados de ejemplo en el Firestore de
// PRODUCCIÓN (habilis-eb89c) para que myhabilis.com se vea poblado al grabar.
//
// Todo queda marcado con esDemo:true para poder identificarlo después.
// Uso:  node scripts/seedDemo.mjs
//
// Limpieza posterior: node scripts/unseedDemo.mjs (ver ese archivo — Firestore
// no permite delete en tecnicos/trabajos por reglas de seguridad, así que
// "limpiar" = ocultar, no borrar. Ver notas al final de ese script.)

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firebaseConfig } from "../src/lib/config.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

const PASSWORD = "HabilisDemo2026!"; // cuentas de demo, no importa que sea fija

const TECNICOS = [
  {
    email: "demo.electricista.cdmx@habilisdemo.mx",
    nombre: "Raúl Jiménez Torres", oficio: "Electricista", ciudad: "Ciudad de México",
    experiencia: 12, plan: "pro", verificado: true, rating: 4.9, totalTrabajos: 38, totalReviews: 34,
    bio: "Electricista certificado con 12 años de experiencia en instalaciones residenciales y comerciales. Especialista en paneles eléctricos, cableado estructurado y sistemas de emergencia.",
    disponibilidad: "Lunes a sábado, 8:00–19:00",
    trabajos: [
      { titulo:"Instalación de panel eléctrico 200A", tipo:"Instalación",
        problema:"Casa nueva sin panel eléctrico certificado, instalación provisional del constructor no cumplía norma.",
        solucion:"Instalé panel eléctrico 200A con breakers termomagnéticos, tierra física y protección contra sobretensión.",
        materiales:"Panel Square D 200A, cable calibre 2/0, varilla de tierra", tiempoHoras:6, costoTotal:4800,
        clienteNombre:"Fam. Rodríguez", estado:"validado" },
      { titulo:"Reparación de corto circuito recurrente", tipo:"Reparación",
        problema:"El cliente reportaba que los breakers se disparaban 3-4 veces por semana sin causa aparente.",
        solucion:"Encontré cableado dañado por roedores en el ático, reemplacé el tramo afectado y sellé el paso.",
        materiales:"Cable THHN calibre 12, cinta aislante, sellador", tiempoHoras:3, costoTotal:1500,
        clienteNombre:"Carlos Medina", estado:"validado" },
    ],
  },
  {
    email: "demo.plomeria.cancun@habilisdemo.mx",
    nombre: "Marisol Peña Cordero", oficio: "Plomero", ciudad: "Cancún",
    experiencia: 9, plan: "pro", verificado: true, rating: 4.8, totalTrabajos: 29, totalReviews: 25,
    bio: "Especialista en plomería residencial y detección de fugas. Trabajo con cámara de inspección para diagnósticos sin romper paredes.",
    disponibilidad: "Todos los días, 7:00–20:00",
    trabajos: [
      { titulo:"Detección y reparación de fuga oculta", tipo:"Diagnóstico",
        problema:"Recibo de agua triplicado sin fugas visibles en la casa.",
        solucion:"Localicé fuga en tubería bajo el piso de la cocina con cámara de inspección, reparé sin romper todo el piso.",
        materiales:"Tubería CPVC, conectores, sellador epóxico", tiempoHoras:5, costoTotal:2800,
        clienteNombre:"Hotel Playa Azul", estado:"validado" },
      { titulo:"Cambio de calentador de agua", tipo:"Instalación",
        problema:"Calentador de 10 años dejó de encender, cliente pedía uno de paso más eficiente.",
        solucion:"Instalé calentador de paso nuevo con conexión de gas certificada y prueba de fugas.",
        materiales:"Calentador de paso 6L, manguera de gas, teflón", tiempoHoras:4, costoTotal:3200,
        clienteNombre:"Laura Chan", estado:"terminado" },
    ],
  },
  {
    email: "demo.hvac.gdl@habilisdemo.mx",
    nombre: "Jorge Luis Hernández", oficio: "Técnico HVAC / Minisplits", ciudad: "Guadalajara",
    experiencia: 7, plan: "gratis", verificado: true, rating: 4.6, totalTrabajos: 21, totalReviews: 18,
    bio: "Instalación y mantenimiento de minisplits y aires centrales. Certificado en manejo de refrigerantes ecológicos.",
    disponibilidad: "Lunes a viernes, 9:00–18:00",
    trabajos: [
      { titulo:"Instalación de minisplit 1.5 toneladas", tipo:"Instalación",
        problema:"Recámara principal sin clima, cliente quería equipo silencioso e inverter.",
        solucion:"Instalé minisplit inverter 1.5 ton con soporte antivibración y carga de gas verificada.",
        materiales:"Minisplit inverter, tubería de cobre, gas R410A", tiempoHoras:4, costoTotal:9500,
        clienteNombre:"Ricardo Ávila", estado:"validado" },
      { titulo:"Mantenimiento preventivo a 4 equipos", tipo:"Mantenimiento",
        problema:"Oficina con 4 minisplits sin servicio en más de un año, mal olor al encender.",
        solucion:"Limpieza profunda de evaporadores y condensadores, desinfección y revisión de presión de gas en los 4 equipos.",
        materiales:"Líquido desinfectante para AC, gas de recarga", tiempoHoras:5, costoTotal:2600,
        clienteNombre:"Despacho Contable Ruiz", estado:"validado" },
    ],
  },
  {
    email: "demo.cctv.mty@habilisdemo.mx",
    nombre: "Daniela Ruiz Campos", oficio: "Instalador CCTV", ciudad: "Monterrey",
    experiencia: 6, plan: "pro", verificado: true, rating: 5.0, totalTrabajos: 24, totalReviews: 22,
    bio: "Diseño e instalación de sistemas de videovigilancia con acceso remoto desde celular. Trabajo con negocios y residencias.",
    disponibilidad: "Lunes a sábado, 8:00–18:00",
    trabajos: [
      { titulo:"Sistema de 8 cámaras para bodega", tipo:"Instalación",
        problema:"Bodega sin vigilancia, había reportes de faltantes de inventario.",
        solucion:"Instalé sistema de 8 cámaras 4MP con DVR y acceso remoto configurado en el celular del dueño.",
        materiales:"8 cámaras 4MP, DVR 8 canales, cable coaxial siamés", tiempoHoras:8, costoTotal:14500,
        clienteNombre:"Distribuidora Del Norte", estado:"validado" },
      { titulo:"Reparación de cámaras sin señal", tipo:"Reparación",
        problema:"3 de 6 cámaras dejaron de transmitir tras una tormenta.",
        solucion:"Reemplacé conectores dañados por humedad y protegí las conexiones con gel dieléctrico.",
        materiales:"Conectores BNC, gel dieléctrico", tiempoHoras:2, costoTotal:900,
        clienteNombre:"Farmacia San Rafael", estado:"validado" },
    ],
  },
  {
    email: "demo.herreria.cdmx@habilisdemo.mx",
    nombre: "Alejandro Domínguez", oficio: "Herrero", ciudad: "Ciudad de México",
    experiencia: 15, plan: "gratis", verificado: false, rating: 4.3, totalTrabajos: 42, totalReviews: 30,
    bio: "Herrería estructural y decorativa: portones, escaleras, barandales y estructuras metálicas a medida.",
    disponibilidad: "Lunes a sábado, 8:00–18:00",
    trabajos: [
      { titulo:"Portón corredizo automatizado", tipo:"Instalación",
        problema:"Cliente quería reemplazar portón manual pesado por uno automático.",
        solucion:"Fabriqué portón corredizo de 4m con motor automático y control remoto.",
        materiales:"Tubular estructural, motor para portón, riel", tiempoHoras:16, costoTotal:22000,
        clienteNombre:"Fam. Torres Aguilar", estado:"validado" },
    ],
  },
  {
    email: "demo.mecanico.gdl@habilisdemo.mx",
    nombre: "Fernando Castillo Vega", oficio: "Mecánico", ciudad: "Guadalajara",
    experiencia: 10, plan: "gratis", verificado: true, rating: 4.5, totalTrabajos: 55, totalReviews: 40,
    bio: "Mecánico automotriz general, especialista en diagnóstico computarizado y frenos.",
    disponibilidad: "Lunes a sábado, 9:00–19:00",
    trabajos: [
      { titulo:"Diagnóstico de falla intermitente de motor", tipo:"Diagnóstico",
        problema:"Auto se apagaba solo en tráfico sin código de falla claro en el scanner básico.",
        solucion:"Diagnostiqué sensor de cigüeñal intermitente con scanner avanzado, lo reemplacé y probé en carretera.",
        materiales:"Sensor de cigüeñal original", tiempoHoras:3, costoTotal:1800,
        clienteNombre:"Mónica Reyes", estado:"validado" },
    ],
  },
  {
    email: "demo.redes.cancun@habilisdemo.mx",
    nombre: "Patricia Nava Solís", oficio: "Técnico en redes", ciudad: "Cancún",
    experiencia: 5, plan: "pro", verificado: true, rating: 4.7, totalTrabajos: 17, totalReviews: 15,
    bio: "Configuración de redes para hoteles y oficinas: WiFi de alta densidad, cableado estructurado y cámaras en red.",
    disponibilidad: "Lunes a viernes, 9:00–18:00",
    trabajos: [
      { titulo:"WiFi de alta densidad para 40 habitaciones", tipo:"Instalación",
        problema:"Hotel boutique con quejas constantes de huéspedes por WiFi lento.",
        solucion:"Rediseñé la red con 12 access points administrados y cableado nuevo a cada piso.",
        materiales:"12 access points, switch administrable, cable Cat6", tiempoHoras:20, costoTotal:38000,
        clienteNombre:"Hotel Boutique Caribe", estado:"validado" },
    ],
  },
  {
    email: "demo.refrigeracion.mty@habilisdemo.mx",
    nombre: "Ismael Torres Beltrán", oficio: "Refrigeración", ciudad: "Monterrey",
    experiencia: 11, plan: "gratis", verificado: false, rating: 4.4, totalTrabajos: 33, totalReviews: 20,
    bio: "Reparación de refrigeradores, cámaras frías y equipos de refrigeración comercial.",
    disponibilidad: "Lunes a sábado, 8:00–19:00",
    trabajos: [
      { titulo:"Reparación de cámara fría de restaurante", tipo:"Reparación",
        problema:"Cámara fría no bajaba de 8°C, riesgo de perder inventario de carnes.",
        solucion:"Reemplacé compresor dañado y recargué gas refrigerante, verificado a -2°C tras 24h.",
        materiales:"Compresor 1/2 HP, gas R404A", tiempoHoras:5, costoTotal:7200,
        clienteNombre:"Restaurante El Asador", estado:"validado" },
    ],
  },
  {
    email: "demo.pintor.cdmx@habilisdemo.mx",
    nombre: "Sofía Martínez Alarcón", oficio: "Pintor", ciudad: "Ciudad de México",
    experiencia: 8, plan: "gratis", verificado: false, rating: 4.2, totalTrabajos: 26, totalReviews: 19,
    bio: "Pintura residencial y comercial, acabados especiales y trabajo con impermeabilizantes.",
    disponibilidad: "Lunes a sábado, 8:00–18:00",
    trabajos: [
      { titulo:"Impermeabilización de azotea", tipo:"Mantenimiento",
        problema:"Filtraciones de agua en el techo del cuarto principal durante lluvias.",
        solucion:"Apliqué sistema impermeabilizante de 3 capas con malla en juntas y desagües.",
        materiales:"Impermeabilizante acrílico, malla, sellador", tiempoHoras:10, costoTotal:6500,
        clienteNombre:"Fam. Ortiz Beltrán", estado:"validado" },
    ],
  },
];

async function main() {
  for (const t of TECNICOS) {
    let uid;
    try {
      const cred = await createUserWithEmailAndPassword(auth, t.email, PASSWORD);
      uid = cred.user.uid;
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        const cred = await signInWithEmailAndPassword(auth, t.email, PASSWORD);
        uid = cred.user.uid;
      } else {
        console.error(`✗ Error creando ${t.email}:`, e.message);
        continue;
      }
    }

    await setDoc(doc(db, "tecnicos", uid), {
      nombre: t.nombre, email: t.email, oficio: t.oficio, ciudad: t.ciudad,
      experiencia: t.experiencia, bio: t.bio, disponibilidad: t.disponibilidad,
      herramientas: true, tipo: "tecnico", plan: t.plan, verificado: t.verificado,
      rating: t.rating, totalTrabajos: t.totalTrabajos, totalReviews: t.totalReviews,
      disponible: true, esDemo: true,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    console.log(`✓ ${t.nombre} — ${t.oficio}, ${t.ciudad} (uid ${uid})`);

    for (const w of t.trabajos) {
      await addDoc(collection(db, "trabajos"), {
        titulo: w.titulo, tipo: w.tipo, descripcion: "", problema: w.problema,
        solucion: w.solucion, materiales: w.materiales, tiempoHoras: w.tiempoHoras,
        costoTotal: w.costoTotal, ciudad: t.ciudad, clienteNombre: w.clienteNombre,
        estado: w.estado, tecnicoId: uid, evidencias: [], esDemo: true,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
    }
    console.log(`  + ${t.trabajos.length} trabajo(s) documentado(s)`);
  }
  console.log("\nListo. Recarga myhabilis.com y ve a Buscar / Feed.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
