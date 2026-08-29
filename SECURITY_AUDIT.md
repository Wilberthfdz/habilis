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

### 10. No existe flujo de "olvidé mi contraseña" — ✅ RESUELTO (12 ago 2026)
Cuando se hizo la auditoría no había ningún `sendPasswordResetEmail` en el código. No era una vulnerabilidad sino un hueco de producto, y ya se cubrió: `enviarResetPassword()` en `src/lib/firebase.js`, conectado desde la pantalla de inicio de sesión (`src/pages/Login.jsx`).

### 11. `servicios` (historial de servicio de equipos) sin scope de dueño
Cualquier autenticado puede leer/crear/editar registros de servicio de **cualquier** `activoId`, no solo los propios. No se corrigió porque el flujo real probablemente necesita que un técnico (con un uid distinto al dueño del equipo) registre un servicio en el equipo de un cliente — restringir por dueño rompería ese caso de uso legítimo sin más contexto de producto. Queda como pendiente de decisión, no de seguridad pura.

### 12. `webhookMP` no valida la firma (`x-signature`) de Mercado Pago — ✅ RESUELTO (29 ago 2026)
Lo que ya hacía bien: nunca confía en el `status`/monto que manda el body del webhook — siempre vuelve a preguntarle a la API real de Mercado Pago (con nuestro token) antes de escribir algo en Firestore. Eso mitigaba el riesgo principal.

Se añadió la capa extra: `functions/mpFirma.js` valida el HMAC-SHA256 de `x-signature` con comparación en tiempo constante, cubierto por 12 pruebas (`npm test`). Requiere configurar el secreto `MP_WEBHOOK_SECRET` que Mercado Pago entrega al dar de alta el webhook; mientras no esté configurado, la función registra un aviso en los logs en lugar de romper el flujo.

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

*Actualizado al 29 de agosto de 2026.*

- [ ] Rotar/confirmar revocación de la key vieja de Gemini (punto anterior).
- [ ] Activar el plan Blaze de Firebase (requerido para Cloud Functions con triggers/schedulers).
- [ ] Configurar los cuatro secrets: `GEMINI_KEY`, `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `FACTURAPI_KEY` — procedimiento en `SETUP_PAGOS.md`.
- [ ] `firebase deploy --only functions` y `firebase deploy --only firestore` — todo el backend (cobros, facturación, soporte con IA, agentes), las reglas nuevas y el índice compuesto están en el repo pero **sin desplegar**.
- [ ] Dar de alta el webhook en Mercado Pago con **los dos** eventos (`subscription_preapproval` y `subscription_authorized_payment`).
- [ ] Decidir el scope correcto de `servicios` (hallazgo #11) — necesita tu input de producto, no es un fix de seguridad directo.
- [ ] Revisión de los textos legales (Términos y Aviso de Privacidad) por un abogado antes de operar en producción.

### Resueltos desde la auditoría original

- ✅ Flujo de "olvidé mi contraseña" (hallazgo #10) — construido el 12 ago 2026.
- ✅ Validación de firma del webhook de Mercado Pago (hallazgo #12) — 29 ago 2026.
- ✅ Cobro real de la suscripción Pro de punta a punta: checkout, códigos de descuento, renovación mensual, cancelación desde la app y CFDI.
- ✅ Primeras pruebas automatizadas del proyecto y CI en GitHub Actions.

### Segunda revisión de seguridad — 29 de agosto de 2026

Revisión enfocada en el flujo de cobros nuevo. Dos hallazgos verificados como reales, ambos ya corregidos; ambos permitían emitir **CFDIs duplicados** (documentos fiscales con RFC elegido por quien llamara) contra un solo cobro:

1. **Concurrencia en `emitirFactura`.** Consultaba el cobro sin facturar, llamaba a Facturapi y marcaba `facturada` hasta el final; varias peticiones simultáneas timbraban el mismo cobro. Ahora el cobro se aparta en una transacción antes de timbrar, y se libera si Facturapi falla.
2. **Reentrega del webhook.** `registrarPagoSuscripcion` escribía `facturada: false` en cada entrega, rehabilitando un cobro ya timbrado. Ese campo ahora solo se inicializa al crear el documento.

De menor impacto, también corregido: el tope de usos de un código de descuento se comprobaba al pagar pero se incrementaba al confirmarse el pago, así que un código de un solo uso se podía canjear en paralelo y la preaprobación con descuento quedaba válida para toda la vida de la suscripción. El uso se aparta ahora en el checkout, y se respeta el campo `activo`.

Descartado como falso positivo: la firma del webhook sin verificar cuando `MP_WEBHOOK_SECRET` no está configurado. El webhook nunca confía en el cuerpo y re-consulta el estado real a la API de Mercado Pago, así que lo máximo que se lograría es forzar una resincronización de información verdadera.

## Ya desplegado en producción

- ✅ `firestore.rules` con todos los fixes de esta auditoría — **ya está en vivo** en `habilis-eb89c`.
