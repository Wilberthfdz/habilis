// La búsqueda por cercanía no puede publicar dónde vive un técnico: en
// México el domicilio es dato personal y muchos guardan herramienta en
// casa. Estas pruebas fijan esa garantía.
import { test } from "node:test";
import assert from "node:assert/strict";
import { difuminar, puntoDeBusqueda, distanciaKm, textoDistancia, rangosCercanos } from "../src/lib/geo.js";

test("el punto guardado NUNCA es el punto exacto", () => {
  const exacto = { lat: 21.161908, lng: -86.851528 };
  const guardado = puntoDeBusqueda(exacto);
  assert.notEqual(guardado.lat, exacto.lat);
  assert.notEqual(guardado.lng, exacto.lng);
});

test("el desvío es suficiente para no señalar una casa", () => {
  // Dos domicilios de la misma manzana tienen que caer en el mismo punto.
  const casaA = { lat: 21.1615, lng: -86.8512 };
  const casaB = { lat: 21.1619, lng: -86.8518 };
  assert.deepEqual(difuminar(casaA), difuminar(casaB));
});

test("pero conserva la utilidad: sigue siendo el mismo barrio", () => {
  const exacto = { lat: 21.161908, lng: -86.851528 };
  assert.ok(distanciaKm(exacto, puntoDeBusqueda(exacto)) < 1.2);
});

test("dos ciudades distintas no se confunden", () => {
  const cancun = puntoDeBusqueda({ lat: 21.1619, lng: -86.8515 });
  const cdmx   = puntoDeBusqueda({ lat: 19.4326, lng: -99.1332 });
  assert.ok(distanciaKm(cancun, cdmx) > 1000);
  assert.notEqual(cancun.geohash, cdmx.geohash);
});

test("lo que se le enseña al cliente nunca es un punto", () => {
  assert.equal(textoDistancia(0.3), "En tu zona");   // no dice "a 300 m"
  assert.equal(textoDistancia(1.9), "En tu zona");
  assert.equal(textoDistancia(7),   "A unos 7 km");
  assert.equal(textoDistancia(120), "A más de 120 km");
  assert.equal(textoDistancia(null), null);
});

test("los rangos de búsqueda cubren el radio pedido", () => {
  const rangos = rangosCercanos({ lat: 21.1619, lng: -86.8515 }, 25);
  assert.ok(rangos.length > 0);
  rangos.forEach(([desde, hasta]) => {
    assert.equal(typeof desde, "string");
    assert.ok(hasta > desde);
  });
});
