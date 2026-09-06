// La fecha "2026-09-04" se leía como medianoche UTC, que en México ya es el
// día 3: todas las fechas de mantenimiento, compra y validez salían un día
// antes de lo que el usuario había escrito.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fechaLocal, fmtFecha } from "../src/lib/fechas.js";

test("una fecha sin hora se lee en el día correcto, no el anterior", () => {
  const f = fechaLocal("2026-09-04");
  assert.equal(f.getFullYear(), 2026);
  assert.equal(f.getMonth(), 8);     // septiembre
  assert.equal(f.getDate(), 4);
});

test("acepta un Timestamp de Firestore", () => {
  const real = new Date(2026, 0, 15);
  assert.equal(fechaLocal({ toDate: () => real }).getTime(), real.getTime());
});

test("acepta un Date tal cual", () => {
  const d = new Date(2026, 5, 1);
  assert.equal(fechaLocal(d), d);
});

test("un valor vacío o inválido no produce 'Invalid Date'", () => {
  assert.equal(fechaLocal(null), null);
  assert.equal(fechaLocal(""), null);
  assert.equal(fechaLocal("no es fecha"), null);
  assert.equal(fmtFecha(null), "—");
  assert.equal(fmtFecha("no es fecha"), "—");
});

test("una marca ISO completa conserva su instante", () => {
  const iso = "2026-09-04T15:30:00.000Z";
  assert.equal(fechaLocal(iso).getTime(), new Date(iso).getTime());
});
