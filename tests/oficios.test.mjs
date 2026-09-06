// Comprueba que el alta acepte de verdad a cualquier persona: los oficios
// del catálogo quedan clasificados, y los que no están en él se guardan tal
// cual en lugar de rechazarse.
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolverOficioLibre } from "../src/lib/oficios.js";

test("un oficio del catálogo queda clasificado en su categoría", () => {
  const r = resolverOficioLibre("electricista");
  assert.equal(r.categoriaId, "electricidad");
  assert.equal(r.oficio, "electricista");
});

test("una especialidad concreta arrastra también su subcategoría", () => {
  const r = resolverOficioLibre("minisplit");
  assert.equal(r.categoriaId, "clima");
  assert.ok(r.subcategoriaId?.startsWith("clima."), `subcategoría inesperada: ${r.subcategoriaId}`);
});

test("un oficio fuera del catálogo se guarda igual, no se rechaza", () => {
  const r = resolverOficioLibre("Tapicero de muebles");
  assert.equal(r.oficio, "Tapicero de muebles");
  assert.equal(r.oficioLibre, "Tapicero de muebles");
  assert.ok(r.categoriaId, "debe quedar con alguna categoría, aunque sea 'otro'");
});

test("jardinero: nadie se queda fuera por no ser técnico de oficio clásico", () => {
  const r = resolverOficioLibre("jardinero");
  assert.equal(r.oficio, "jardinero");
  assert.ok(r.categoriaId);
});

test("texto vacío no produce un perfil sin oficio", () => {
  assert.equal(resolverOficioLibre("   "), null);
  assert.equal(resolverOficioLibre(""), null);
});

test("el texto se recorta antes de guardarse", () => {
  assert.equal(resolverOficioLibre("  Fumigador  ").oficio, "Fumigador");
});
