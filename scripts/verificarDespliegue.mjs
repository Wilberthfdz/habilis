#!/usr/bin/env node
// Comprueba que el sitio en vivo sirve realmente la versión nueva.
//
// La consola de Firebase dice que hubo un despliegue, pero no si el código
// publicado trae los cambios. Esto busca marcas concretas dentro del bundle
// que sirve myhabilis.com, así que no se puede confundir.
//
// Uso:  node scripts/verificarDespliegue.mjs  [url]

const BASE = (process.argv[2] || "https://myhabilis.com").replace(/\/+$/, "");

// Cada marca es un texto que SOLO existe en el código nuevo.
const MARCAS = [
  ["Página de pago /pro",            "Pagar con tarjeta (automático)"],
  ["Pago con OXXO/SPEI",             "OXXO, SPEI o tarjeta"],
  ["Historial de facturas",          "Tus facturas"],
  ["Cancelar suscripción",           "Cancelar suscripción"],
  ["Intención de Pro al registrarse","Vas por el Plan Pro"],
  ["Precio con IVA incluido",        "IVA incluido"],
  ["Modelo de plataforma",           "no el prestador del servicio"],
  ["Soporte con IA",                 "Asistente Habilis"],
  ["Menú Acerca de",                 "Cómo funciona la app"],
  ["Verificación de identidad",      "Verifica tu identidad"],
  ["Link bonito de perfil",          "Comparte tu perfil"],
  ["Agenda de citas",                "Mi agenda"],
];

// Textos que YA NO deben aparecer: si siguen, el sitio es el viejo.
const RETIRADOS = [
  ["Contradicción de IVA",   "no incluyen IVA"],
  ["\"Sin intermediarios\"", "sin intermediarios"],
  ["Integración CTRL+W",     "CTRL+W"],
];

const traer = async (url) => {
  const r = await fetch(url, { redirect: "follow" });
  if (!r.ok) throw new Error(`HTTP ${r.status} en ${url}`);
  return r.text();
};

try {
  const html = await traer(BASE + "/");
  const archivos = [...html.matchAll(/\/assets\/[A-Za-z0-9_\-.]+\.js/g)].map(m => m[0]);
  if (archivos.length === 0) throw new Error("No se encontró ningún bundle en el HTML.");

  console.log(`Sitio:   ${BASE}`);
  console.log(`Bundles: ${archivos.join(", ")}\n`);

  const codigo = (await Promise.all(archivos.map(a => traer(BASE + a)))).join("\n");

  let fallos = 0;
  console.log("Debe estar presente:");
  for (const [nombre, marca] of MARCAS) {
    const ok = codigo.includes(marca);
    if (!ok) fallos++;
    console.log(`  ${ok ? "✅" : "❌"} ${nombre}`);
  }

  console.log("\nDebe haber desaparecido:");
  for (const [nombre, marca] of RETIRADOS) {
    const fuera = !codigo.includes(marca);
    if (!fuera) fallos++;
    console.log(`  ${fuera ? "✅" : "❌"} ${nombre}`);
  }

  console.log(fallos === 0
    ? "\n✅ El sitio en vivo ya sirve la versión nueva."
    : `\n❌ ${fallos} comprobación(es) fallaron: el hosting sigue en la versión vieja.\n   Ejecuta: npm run deploy`);
  process.exit(fallos === 0 ? 0 : 1);
} catch (e) {
  console.error("No se pudo verificar:", e.message);
  process.exit(2);
}
