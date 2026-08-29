# Configuración de pagos (Mercado Pago + Facturapi)

Guía para dejar operativo el cobro del Plan Pro. **Ninguna credencial vive en
este repositorio**: todas se guardan en Google Secret Manager a través de
`firebase functions:secrets:set`, que es el mecanismo que ya usa el backend
(`defineSecret` en `functions/index.js`).

---

## Por qué no usamos un archivo `.env`

Es la duda razonable —"lo meto en un `.env` y listo"— pero para este caso
Secret Manager es mejor:

| | `.env` en el repo | `.env` local sin subir | **Secret Manager (lo que usamos)** |
|---|---|---|---|
| Queda en el historial de git | Sí, para siempre | No | No |
| Cifrado en reposo | No | No | Sí |
| Control de acceso por persona (IAM) | No | No | Sí |
| Versionado y rotación | No | No | Sí |
| Auditoría de quién lo leyó | No | No | Sí |

Un `.env` sí sirve para **desarrollo local** (`functions/.env`, ya está en
`.gitignore`). Para lo que está desplegado, Secret Manager.

---

## 1. Credenciales que necesitas

De Mercado Pago → *Tus integraciones* → tu aplicación → *Credenciales*:

- **Access token** (privado). El único que necesita el backend. Empieza con
  `TEST-` en pruebas y con `APP_USR-` en producción.
- **Clave secreta del webhook** (privada). Se genera en *Webhooks* →
  *Configurar notificaciones*, al dar de alta la URL.
- La **public key** no se usa: el cobro redirige al checkout alojado de
  Mercado Pago, así que el navegador nunca maneja credenciales.

De Facturapi → *Configuración* → *API Keys*: la **secret key** (`sk_test_…`
o `sk_live_…`).

> **Nunca** pegues estos valores en un chat, un ticket, un comentario de
> código o un commit. Si alguno se expuso, revócalo y genera uno nuevo desde
> el panel del proveedor: es gratis y toma un minuto.

---

## 2. Guardar los secretos

Requisito previo: plan **Blaze** activo en Firebase (las Cloud Functions con
triggers y scheduler lo necesitan).

Cada comando pide el valor de forma interactiva; **no lo escribas en la línea
de comandos** (quedaría en el historial de tu shell):

```bash
firebase functions:secrets:set MP_ACCESS_TOKEN
firebase functions:secrets:set MP_WEBHOOK_SECRET
firebase functions:secrets:set FACTURAPI_KEY
firebase functions:secrets:set GEMINI_KEY
```

Verificar qué hay guardado (muestra versiones, nunca los valores):

```bash
firebase functions:secrets:access MP_ACCESS_TOKEN   # solo si necesitas leerlo
firebase functions:secrets:prune                    # limpia versiones sin usar
```

Desplegar para que las funciones tomen los secretos:

```bash
firebase deploy --only functions
```

---

## 3. Registrar el webhook en Mercado Pago

Después del primer deploy, la URL del webhook es:

```
https://us-central1-<TU-PROYECTO>.cloudfunctions.net/webhookMP
```

En Mercado Pago → *Tus integraciones* → tu aplicación → *Webhooks*:

1. Da de alta esa URL.
2. Suscríbete a **los dos** eventos, no solo al primero:
   - **Planes y suscripciones** (`subscription_preapproval`) — alta, pausa y
     cancelación: es lo que da y quita el plan Pro.
   - **Pagos de suscripción** (`subscription_authorized_payment`) — el cobro
     de cada mes. Sin este evento solo quedaría registrado el primer pago y
     las renovaciones no aparecerían en Finanzas ni podrían facturarse.
3. Copia la **clave secreta** que te da y guárdala como `MP_WEBHOOK_SECRET`
   (paso 2). Mientras no esté configurada, el backend acepta las
   notificaciones pero deja un aviso en los logs diciendo que no está
   verificando la firma.

---

## 4. Probar en modo sandbox

Con las credenciales `TEST-`, Mercado Pago no cobra dinero real:

1. Entra a `/pro` en la app con una cuenta de técnico.
2. Pulsa *Pagar con Mercado Pago*.
3. Paga con una [tarjeta de prueba](https://www.mercadopago.com.mx/developers/es/docs/your-integrations/test/cards)
   usando un **usuario de prueba comprador** (no tu cuenta real; MP rechaza
   que el mismo usuario sea vendedor y comprador).
4. Verifica el resultado:
   - En Firestore, el documento del técnico en `tecnicos` pasa a `plan: "pro"`.
   - Se crea un registro en `pagos` con el monto real cobrado.
   - Si usaste un código de descuento, sube `usosActuales` en `promos`.
   - En los logs (`firebase functions:log --only webhookMP`) no debe aparecer
     el aviso de firma no verificada.

---

## 5. Pasar a producción

1. Cambia en Mercado Pago a credenciales de producción (`APP_USR-…`) y
   vuelve a ejecutar `firebase functions:secrets:set MP_ACCESS_TOKEN`.
2. Regenera la clave del webhook para producción y actualiza
   `MP_WEBHOOK_SECRET`.
3. En Facturapi, sube tus CSD del SAT y cambia a la key `sk_live_…`.
4. `firebase deploy --only functions`.
5. Haz una compra real de $100 y confirma que llega el CFDI.

---

## Rotar una credencial expuesta

1. En el panel del proveedor, genera una credencial nueva (Mercado Pago:
   *Renovar credenciales*; Facturapi: crear una API key nueva y borrar la
   anterior).
2. `firebase functions:secrets:set <NOMBRE>` con el valor nuevo.
3. `firebase deploy --only functions` para que las funciones tomen la
   versión nueva.
4. `firebase functions:secrets:prune` para retirar las versiones viejas.
