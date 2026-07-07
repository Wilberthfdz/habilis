// ─── SEED MASIVO: ~5 TÉCNICOS POR OFICIO, CON FOTO ─────────────────────────
// Amplía scripts/seedDemo.mjs: crea 5 técnicos por cada oficio real de la
// plataforma (12 oficios), con avatar tipo ilustración (DiceBear, gratis,
// sin API key) para que se vea "con fotos" en vez de solo iniciales.
//
// No son fotos de rostros reales (no tengo esa capacidad) — son avatares
// ilustrados únicos por persona, estilo común en apps de demo.
//
// Uso: node scripts/seedDemo2.mjs

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firebaseConfig } from "../src/lib/config.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

const PASSWORD = "HabilisDemo2026!";

const NOMBRES = [
  "Diego Morales Ruiz","Valentina Sánchez Ortiz","Miguel Ángel Reyes","Camila Guerrero Luna",
  "Emilio Vargas Castro","Ximena Delgado Ríos","Sebastián Cruz Mendoza","Fernanda Aguilar Soto",
  "Rodrigo Flores Navarro","Andrea Salazar Camacho","Iván Contreras Pérez","Renata Ibarra Gómez",
  "Alberto Villalobos","Karla Espinoza Duarte","Julián Escobar Ponce","Natalia Cabrera Rivas",
  "Héctor Zamora Miranda","Paola Cervantes León","Mauricio Trejo Sandoval","Daniela Rangel Vega",
  "Osvaldo Cortés Molina","Gabriela Rosas Barrera","Arturo Nieves Chávez","Beatriz Solano Marín",
  "Cristian Pacheco Uribe","Melissa Godínez Paz","Ricardo Bautista Serrano","Yolanda Meza Cordero",
  "Adrián Rivera Fonseca","Lorena Bermúdez Gil","Enrique Loera Palacios","Verónica Anaya Quintero",
  "Salvador Montes Herrera","Claudia Villaseñor Ochoa","Gerardo Tapia Robles","Elisa Carranza Muñiz",
  "Tomás Zúñiga Beltrán","Rocío Padilla Estrada","Ignacio Valenzuela Ríos","Isabel Cano Peñaloza",
  "Néstor Aranda Cordero","Silvia Mejía Torres","Emiliano Vera Domínguez","Alejandra Núñez Rivas",
  "Braulio Ochoa Sandoval","Guadalupe Rentería Solís","Federico Camacho Islas","Marcela Bravo Guerrero",
  "Leonardo Quintanilla","Itzel Marroquín Cabrera","Rubén Galindo Escamilla","Yesenia Corona Fuentes",
  "Ezequiel Barajas Lugo","Adriana Zepeda Cortez","César Villagómez Neri","Tania Robledo Pineda",
  "Omar Sotelo Betancourt","Fabiola Treviño Salas","Vicente Cardona Elizondo","Perla Argüello Nava",
];

const CIUDADES = [
  "Ciudad de México","Cancún","Guadalajara","Monterrey","Mérida","Puebla",
  "Querétaro","Tijuana","León","Playa del Carmen","Toluca","Chihuahua",
];

const OFICIOS_INFO = {
  "Electricista": {
    slug: "electricista",
    skill: "instalaciones eléctricas residenciales y comerciales, tableros, cableado y sistemas de emergencia",
    trabajo: { titulo:"Instalación de circuito eléctrico dedicado", tipo:"Instalación",
      problema:"El cliente necesitaba un circuito dedicado para equipo de alto consumo sin sobrecargar el tablero existente.",
      solucion:"Instalé circuito dedicado con breaker independiente, cableado calibre adecuado y prueba de continuidad.",
      materiales:"Breaker, cable THHN, canaleta", tiempoHoras:4, costoTotal:2200 },
  },
  "Plomero": {
    slug: "plomero",
    skill: "plomería residencial, detección de fugas e instalación de calentadores",
    trabajo: { titulo:"Reparación de fuga en tubería principal", tipo:"Reparación",
      problema:"Fuga constante bajo el fregadero que dañaba el mueble de cocina.",
      solucion:"Reemplacé tramo de tubería dañada, sellé conexiones y verifiqué presión de agua.",
      materiales:"Tubería CPVC, conectores, cinta teflón", tiempoHoras:2, costoTotal:1100 },
  },
  "Técnico HVAC / Minisplits": {
    slug: "hvac",
    skill: "instalación y mantenimiento de minisplits, carga de gas refrigerante y limpieza de equipos",
    trabajo: { titulo:"Mantenimiento preventivo de minisplit", tipo:"Mantenimiento",
      problema:"Equipo con mal olor al encender y poco enfriamiento tras meses sin servicio.",
      solucion:"Limpieza de filtros y serpentín, desinfección y verificación de presión de gas.",
      materiales:"Líquido desinfectante para AC", tiempoHoras:2, costoTotal:900 },
  },
  "Albañil": {
    slug: "albanil",
    skill: "construcción y remodelación general, aplanados, colocación de piso y muros",
    trabajo: { titulo:"Remodelación de baño completo", tipo:"Otro",
      problema:"Baño con instalación de los años 90, piso y muros deteriorados.",
      solucion:"Demolición controlada, impermeabilización, colocación de piso y azulejo nuevo.",
      materiales:"Cemento, piso cerámico, impermeabilizante", tiempoHoras:40, costoTotal:18500 },
  },
  "Tablaroquero": {
    slug: "tablaroca",
    skill: "muros y plafones de tablaroca, aislamiento acústico y acabados",
    trabajo: { titulo:"Plafón con iluminación indirecta", tipo:"Instalación",
      problema:"Sala sin plafón, cliente quería iluminación indirecta oculta.",
      solucion:"Instalé estructura de tablaroca con canal para tira LED y acabado liso listo para pintar.",
      materiales:"Tablaroca, perfil metálico, tornillería", tiempoHoras:14, costoTotal:9800 },
  },
  "Mecánico": {
    slug: "mecanico",
    skill: "diagnóstico computarizado, frenos y mantenimiento automotriz general",
    trabajo: { titulo:"Cambio de balatas y discos", tipo:"Mantenimiento",
      problema:"Auto con ruido metálico al frenar, balatas al límite de desgaste.",
      solucion:"Reemplacé balatas y discos delanteros, purgué sistema de frenos.",
      materiales:"Balatas cerámicas, discos ventilados", tiempoHoras:2, costoTotal:2400 },
  },
  "Técnico en redes": {
    slug: "redes",
    skill: "cableado estructurado, configuración de WiFi empresarial y cámaras en red",
    trabajo: { titulo:"Reconfiguración de red de oficina", tipo:"Diagnóstico",
      problema:"Oficina con caídas de internet constantes y WiFi con zonas muertas.",
      solucion:"Rediseñé la red con switch administrable y 2 access points adicionales.",
      materiales:"Switch, access points, cable Cat6", tiempoHoras:6, costoTotal:6200 },
  },
  "Instalador CCTV": {
    slug: "cctv",
    skill: "diseño e instalación de videovigilancia con acceso remoto desde celular",
    trabajo: { titulo:"Sistema de cámaras para negocio pequeño", tipo:"Instalación",
      problema:"Tienda sin vigilancia, dueño quería monitoreo desde su celular.",
      solucion:"Instalé 4 cámaras HD con DVR y configuré acceso remoto en su teléfono.",
      materiales:"4 cámaras HD, DVR, cable siamés", tiempoHoras:5, costoTotal:7800 },
  },
  "Pintor": {
    slug: "pintor",
    skill: "pintura residencial y comercial, impermeabilización y acabados especiales",
    trabajo: { titulo:"Pintura interior de casa completa", tipo:"Otro",
      problema:"Casa con pintura descarapelada y manchas de humedad en varios cuartos.",
      solucion:"Resané, sellé manchas de humedad y apliqué dos manos de pintura en toda la casa.",
      materiales:"Pintura vinílica, sellador, resane", tiempoHoras:24, costoTotal:8600 },
  },
  "Soldador": {
    slug: "soldador",
    skill: "soldadura estructural y de precisión, estructuras metálicas a medida",
    trabajo: { titulo:"Estructura metálica para cochera", tipo:"Instalación",
      problema:"Cliente quería techo de cochera con estructura metálica resistente a viento.",
      solucion:"Fabriqué y soldé estructura tubular con anclaje reforzado y acabado anticorrosivo.",
      materiales:"Tubular estructural, electrodos, primer anticorrosivo", tiempoHoras:18, costoTotal:15200 },
  },
  "Refrigeración": {
    slug: "refrigeracion",
    skill: "reparación de refrigeradores, cámaras frías y equipos comerciales",
    trabajo: { titulo:"Reparación de refrigerador comercial", tipo:"Reparación",
      problema:"Refrigerador de abarrotes sin enfriar bien, riesgo de perder mercancía.",
      solucion:"Reemplacé termostato defectuoso y recargué gas refrigerante.",
      materiales:"Termostato, gas R134A", tiempoHoras:3, costoTotal:1900 },
  },
  "Herrero": {
    slug: "herrero",
    skill: "herrería estructural y decorativa, portones, barandales y rejas",
    trabajo: { titulo:"Barandal de escalera con diseño decorativo", tipo:"Instalación",
      problema:"Escalera sin barandal, riesgo de seguridad para niños en casa.",
      solucion:"Fabriqué e instalé barandal de herrería con diseño decorativo y acabado en pintura electrostática.",
      materiales:"Tubular, solera, pintura electrostática", tiempoHoras:10, costoTotal:6800 },
  },
};

const clamp1 = n => Math.round(n * 10) / 10;
let nombreIdx = 0;

async function crearTecnico(oficio, info, i) {
  const nombre = NOMBRES[nombreIdx++ % NOMBRES.length];
  const ciudad = CIUDADES[(nombreIdx + i) % CIUDADES.length];
  const experiencia = 2 + Math.floor(Math.random() * 14);
  const rating = clamp1(4.0 + Math.random() * 1.0);
  const totalTrabajos = 6 + Math.floor(Math.random() * 45);
  const totalReviews = Math.max(3, totalTrabajos - Math.floor(Math.random() * 8));
  const plan = Math.random() < 0.35 ? "pro" : "gratis";
  const verificado = Math.random() < 0.55;
  const email = `demo2.${info.slug}${i + 1}@habilisdemo.mx`;
  const fotoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nombre)}`;

  let uid;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, PASSWORD);
    uid = cred.user.uid;
  } catch (e) {
    if (e.code === "auth/email-already-in-use") {
      const cred = await signInWithEmailAndPassword(auth, email, PASSWORD);
      uid = cred.user.uid;
    } else {
      console.error(`✗ ${email}:`, e.message);
      return;
    }
  }

  await setDoc(doc(db, "tecnicos", uid), {
    nombre, email, oficio, ciudad, experiencia,
    bio: `Especialista en ${info.skill}. ${experiencia} años de experiencia trabajando en ${ciudad} y alrededores.`,
    disponibilidad: "Lunes a sábado, 8:00–18:00",
    herramientas: true, tipo: "tecnico", plan, verificado, rating,
    totalTrabajos, totalReviews, disponible: true, esDemo: true, fotoUrl,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });

  const w = info.trabajo;
  await addDoc(collection(db, "trabajos"), {
    titulo: w.titulo, tipo: w.tipo, descripcion: "", problema: w.problema,
    solucion: w.solucion, materiales: w.materiales, tiempoHoras: w.tiempoHoras,
    costoTotal: w.costoTotal, ciudad, clienteNombre: "Cliente Habilis",
    estado: "validado", tecnicoId: uid, evidencias: [], esDemo: true,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });

  console.log(`✓ ${nombre} — ${oficio}, ${ciudad} (plan:${plan} verificado:${verificado})`);
}

async function main() {
  for (const [oficio, info] of Object.entries(OFICIOS_INFO)) {
    console.log(`\n— ${oficio} —`);
    for (let i = 0; i < 5; i++) {
      await crearTecnico(oficio, info, i);
    }
  }
  console.log("\nListo. ~5 técnicos por oficio agregados con foto (avatar ilustrado).");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
