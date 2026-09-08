import { test } from "node:test";
import assert from "node:assert/strict";
import {
  camposDeInclusion, inclusionDesdePerfil, problemaDeInclusion, MAX_COMO_TRABAJO,
} from "../src/lib/inclusion.js";

test("sin activar no se guarda nada y el filtro queda en falso", () => {
  assert.deepEqual(camposDeInclusion(null, "hoy"), { inclusion: null, perfilIncluyente: false });
  assert.deepEqual(camposDeInclusion({ activo: false, consentimiento: true, tipos: ["motriz"] }, "hoy"),
    { inclusion: null, perfilIncluyente: false });
});

test("activo pero sin consentimiento NO se guarda", () => {
  const r = camposDeInclusion({ activo: true, consentimiento: false, tipos: ["motriz"] }, "hoy");
  assert.equal(r.perfilIncluyente, false);
  assert.equal(r.inclusion, null);
  assert.match(problemaDeInclusion({ activo: true, consentimiento: false }), /consentimiento/);
});

test("activo con consentimiento guarda el bloque completo", () => {
  const r = camposDeInclusion({
    activo: true, consentimiento: true, tipos: ["motriz", "motriz", "inventado"],
    comoTrabajo: "  Diagnóstico remoto y reparación en taller.  ",
  }, "sello");
  assert.equal(r.perfilIncluyente, true);
  assert.deepEqual(r.inclusion, {
    activo: true, consentimiento: true, consentimientoFecha: "sello",
    tipos: ["motriz"], comoTrabajo: "Diagnóstico remoto y reparación en taller.",
  });
  assert.equal(problemaDeInclusion({ activo: true, consentimiento: true }), null);
});

test("el texto se recorta al máximo", () => {
  const r = camposDeInclusion({ activo: true, consentimiento: true, comoTrabajo: "x".repeat(900) }, "s");
  assert.equal(r.inclusion.comoTrabajo.length, MAX_COMO_TRABAJO);
});

test("un perfil existente se carga al formulario y uno sin bloque queda vacío", () => {
  assert.deepEqual(inclusionDesdePerfil({ inclusion: { activo: true, consentimiento: true, tipos: ["visual"], comoTrabajo: "Hola" } }),
    { activo: true, consentimiento: true, tipos: ["visual"], comoTrabajo: "Hola" });
  assert.deepEqual(inclusionDesdePerfil({}), { activo: false, consentimiento: false, tipos: [], comoTrabajo: "" });
  assert.deepEqual(inclusionDesdePerfil({ inclusion: null }), { activo: false, consentimiento: false, tipos: [], comoTrabajo: "" });
});
