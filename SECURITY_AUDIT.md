# Habilis — Auditoría de seguridad

**Fecha:** 2026-07-17
**Alcance:** `src/`, `functions/`, `dist/` (build output), historial de git, `firestore.rules`.

---

## Resumen

Se encontraron **3 vulnerabilidades de severidad alta** (todas corregidas en código y desplegadas en `firestore.rules`), **5 de severidad media** (corregidas), y **3 hallazgos informativos/de bajo riesgo** (documentados, algunos requieren decisión de producto en vez de un fix de seguridad). Las reglas de Firestore corregidas ya están **en producción**. Los cambios de Cloud Functions están en el repo pero **no desplegados** — ver "Acciones pendientes de tu lado".

---

## 🔴 Alta severidad

### 1. Escalación de privilegios desde el cliente (`tecnicos`)
Cualquier usuario autenticado podía escribir **cualquier campo** de su propio documento en `tecnicos` — incluyendo `plan`, `verificado`, `rating`, `totalTrabajos`, `rankScore` — usando el SDK de Firestore directo desde el navegador (consola del navegador, sin necesidad de hackear nada). Se confirmó que esto era explotable en la práctica: existía una función muerta, `activarPlanPro()` en `src/lib/firebase.js`, que escribía `plan:"pro"` sin verificar ningún pago (era un stub de una integración con Conekta que nunca se completó, sin ningún caller en la UI, pero exportada y presente en el bundle).

**Fix:**
- `firestore.rules`: el dueño de un `tecnicos/{uid}` ahora solo puede modificar `nombre, oficio, ciudad, experiencia, bio, fotoUrl, alcance, disponible, updatedAt`. Cualquier otro campo (`plan`, `verificado`, `rating`, etc.) requiere ser admin o el Admin SDK (agentes/webhook de pago).
- Se eliminó `activarPlanPro()` de `src/lib/firebase.js`. El único camino real a Pro ahora es `iniciarSuscripcionPro()` → Mercado Pago → `webhookMP` (backend, verificado).

### 2. Cualquiera podía reescribir cualquier cotización (`cotizaciones`)
La regla era `allow update: if true` — sin restricción de campos ni de quién. Cualquier persona (ni siquiera necesitaba estar autenticada) que conociera o adivinara un ID de cotización podía sobrescribir el documento completo: precio, datos del técnico, datos del cliente, estado — lo que fuera.

**Fix:** el update sin autenticación ahora solo puede tocar el campo `estado`, y solo para ponerlo en `"aceptada"` o `"rechazada"` (que es literalmente lo único que hace el flujo real de `VistaCotizacion.jsx`). El técnico dueño (`tecnicoId`) o el admin conservan acceso completo.

### 3. IDOR en directorio de clientes y catálogo de productos del técnico
`clientes_tecnico` y `productos_tecnico` permitían que **cualquier usuario autenticado** (no solo el dueño) leyera, editara o borrara los clientes/productos de **otro técnico** — las reglas solo verificaban `request.auth != null`, nunca comparaban contra el campo `tecnicoId` real del documento.

**Fix:** ambas colecciones ahora exigen `resource.data.tecnicoId == request.auth.uid` (o admin) para leer/editar/borrar.

---

## 🟡 Media severidad

### 4. Suplantación de dueño al crear documentos
`trabajos`, `activos` y `solicitudes` permitían `create` a cualquier autenticado sin verificar que el campo `tecnicoId`/`userId` del nuevo documento fuera realmente el suyo. Un usuario podía crear un "trabajo" o "solicitud" atribuido a otra persona.
**Fix:** las reglas de `create` ahora exigen `request.resource.data.tecnicoId == request.auth.uid` (o `userId`, según la colección).

### 5. Errores internos filtrados al cliente
`geminiProxy`, `crearSuscripcion` y `emitirFactura` devolvían el texto crudo de error de Gemini/Mercado Pago/Facturapi directo al cliente (hasta 200-500 caracteres de la respuesta interna del proveedor).
**Fix:** los detalles ahora solo van a `console.error` (logs del servidor); el cliente recibe un mensaje genérico.

### 6. Sin rate limiting en `crearSuscripcion` y `emitirFactura`
Estas dos funciones no tenían límite de uso por usuario (a diferencia de `geminiProxy`/`transcribirRegistro`, que sí).
**Fix:** se agregó `checkRateLimit` (10 llamadas/hora) a ambas.

### 7. Subida de fotos sin validar tipo real ni tamaño
`RegistrarTrabajo.jsx` solo tenía `accept="image/*"` (un filtro de UI, no de seguridad — se puede saltar seleccionando "todos los archivos"). No había validación de `file.type`, ni límite de tamaño, ni manejo de error — un archivo no-imagen se quedaba colgado en silencio (sin mensaje ni fallback).
**Fix:** ahora valida `file.type.startsWith("image/")`, límite de 15 MB, y maneja errores de lectura/decodificación mostrando un mensaje al usuario.

### 8. `transcribirRegistro` sin límite de tamaño de audio
Aceptaba cualquier tamaño de `audioBase64`.
**Fix:** límite de ~15 MB en base64.

---

## 🔵 Informativo / bajo riesgo (documentado, no todo requiere fix)

### 9. `apiKey` de Firebase hardcodeada en `src/lib/config.js`
**Esto NO es una vulnerabilidad** — el `apiKey` del config de Firebase Web está diseñado por Google para vivir en el cliente; no protege nada por sí solo (la seguridad real la dan las Firestore Rules + Firebase Auth, que ya están endurecidas). Se documenta para que quede claro que no hace falta "esconderla". *Opcional:* restringir esa key en Google Cloud Console a los APIs/dominios específicos que usa, como capa extra.

### 10. No existe flujo de "olvidé mi contraseña"
No hay ningún `sendPasswordResetEmail` en todo el código. No es una vulnerabilidad, pero la auditoría pidió verificar que "funciona" y la respuesta honesta es que **no existe**. Es un hueco de producto, no de seguridad — no se construyó en esta pasada porque el pedido era una auditoría, no una feature nueva.

### 11. `servicios` (historial de servicio de equipos) sin scope de dueño
Cualquier autenticado puede leer/crear/editar registros de servicio de **cualquier** `activoId`, no solo los propios. No se corrigió porque el flujo real probablemente necesita que un técnico (con un uid distinto al dueño del equipo) registre un servicio en el equipo de un cliente — restringir por dueño rompería ese caso de uso legítimo sin más contexto de producto. Queda como pendiente de decisión, no de seguridad pura.

### 12. `webhookMP` no valida la firma (`x-signature`) de Mercado Pago
Lo que SÍ hace bien: nunca confía en el `status`/monto que manda el body del webhook — siempre vuelve a preguntarle a la API real de Mercado Pago (con nuestro token) antes de escribir algo en Firestore. Eso ya mitiga el riesgo principal. Añadir validación de firma HMAC sería una capa extra, pero requiere el secreto de webhook que Mercado Pago te da en su dashboard (no lo tengo).

---

## ✅ Ya estaba bien (confirmado, sin cambios)

- No hay keys de Gemini/Mercado Pago/Facturapi hardcodeadas en ningún archivo actual de `src/` o `functions/`, ni en el output de `dist/` (build de producción revisado directamente).
- `.gitignore` excluye `.env` correctamente; `functions/.env` nunca estuvo trackeado en git.
- Los mensajes de error de login ya son genéricos ("Correo o contraseña incorrectos.") — no hay enumeración de usuarios.
- No hay ningún `dangerouslySetInnerHTML` en todo el frontend — sin vector de XSS vía HTML inyectado.
- Todas las Cloud Functions callable exigen `requireAuth()` antes de hacer nada (excepto el webhook de Mercado Pago, que por naturaleza es servidor-a-servidor).
- El regex de validación de RFC en `emitirFactura` es correcto.
- `pagos`, `facturas`, `aiLogs`, `rateLimits` ya eran de solo-backend (sin escritura desde el cliente).

---

## ⚠️ Vulnerabilidad NO corregible desde el código: key de Gemini vieja en el historial de git

La key `AIzaSyAAw_l0_rBshf_9kc5yjvWtaFtB0ZdnNHc` sigue apareciendo en el historial de git del repo **público** (confirmado: 2 apariciones en commits pasados de `src/lib/config.js`). Google ya la marcó como filtrada y la bloqueó (confirmado en esta misma sesión, error `403 PERMISSION_DENIED — "reported as leaked"`). Quitarla del código actual no la borra del historial — cualquiera puede seguir viéndola revisando commits viejos en GitHub.

**Esto no lo puedo resolver yo. Necesitas:**
1. Confirmar en https://aistudio.google.com/apikey que esa key está revocada (Google ya la bloqueó automáticamente, pero conviene cerrarlo formalmente ahí también).
2. Decidir si quieres reescribir el historial del repo público (`git filter-repo` o BFG Repo-Cleaner) para borrarla por completo — esto cambia los hashes de todos los commits y es disruptivo si alguien más clonó el repo. Si no te urge, dejarla en el historial ya no es explotable (la key está muerta), solo queda como "mancha" visible.

---

## Acciones pendientes de tu lado

- [ ] Rotar/confirmar revocación de la key vieja de Gemini (punto anterior).
- [ ] Configurar los secrets reales antes de desplegar funciones: `firebase functions:secrets:set GEMINI_KEY / MP_ACCESS_TOKEN / FACTURAPI_KEY`.
- [ ] Activar el plan Blaze de Firebase (requerido para Cloud Functions con triggers/schedulers).
- [ ] `firebase deploy --only functions` — las correcciones de rate limiting y mensajes de error de esta auditoría están en el repo pero **no están desplegadas todavía** (a diferencia de `firestore.rules`, que ya se desplegó).
- [ ] Decidir si quieres construir el flujo de "olvidé mi contraseña" (hallazgo #10).
- [ ] Decidir el scope correcto de `servicios` (hallazgo #11) — necesita tu input de producto, no es un fix de seguridad directo.

## Ya desplegado en producción

- ✅ `firestore.rules` con todos los fixes de esta auditoría — **ya está en vivo** en `habilis-eb89c`.
