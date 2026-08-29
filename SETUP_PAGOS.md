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

Desplegar para que las funciones tomen los secretos, junto con las reglas y
el índice compuesto que usa la facturación:

```bash
firebase deploy --only functions
firebase deploy --only firestore
```

---

## 3. Registrar el webhook en Mercado Pago

**Hazlo antes de desplegar.** Las funciones declaran `MP_WEBHOOK_SECRET`, así
que el deploy pide ese secreto; y la URL no cambia al redesplegar, por lo que
no hace falta desplegar primero para conocerla.

Estas funciones son de 2ª generación y corren sobre Cloud Run, así que la URL
**no** tiene la forma `…cloudfunctions.net`. La del proyecto es:

```
https://webhookmp-zrfph6daoa-uc.a.run.app
```

(Si algún día cambia, se consulta con `firebase functions:list` o en la
consola de Cloud Run.)

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

Con las credenciales `TEST-`, Mercado Pago no cobra dinero real. El backend
detecta solo que el access token empieza con `TEST-` y redirige al checkout
de **sandbox** (`sandbox_init_point`): el checkout de producción no reconoce
a los usuarios de prueba y deja la pantalla pidiendo la cuenta una y otra
vez. No hay que configurar nada para eso.

Antes de probar, crea **usuarios de prueba** en Mercado Pago → *Tus
integraciones* → tu aplicación → *Cuentas de prueba*. Necesitas uno de tipo
comprador: **no puedes pagar con tu cuenta real ni con la del vendedor** —
Mercado Pago rechaza que el mismo usuario sea las dos partes, y esa es la
causa más común de que el checkout parezca no avanzar.

1. Entra a `/pro` en la app con una cuenta de técnico.
2. En *Correo de tu cuenta de Mercado Pago*, pon el correo del **usuario de
   prueba comprador**, no el de tu cuenta de Habilis.
3. Pulsa *Pagar con Mercado Pago* e inicia sesión con ese usuario de prueba.
4. Paga con una [tarjeta de prueba](https://www.mercadopago.com.mx/developers/es/docs/your-integrations/test/cards).
5. Verifica el resultado:
   - En Firestore, el documento del técnico en `tecnicos` pasa a `plan: "pro"`.
   - Se crea un registro en `pagos` con el monto real cobrado.
   - Si usaste un código de descuento, `usosActuales` en `promos` ya subió al
     iniciar el checkout (el uso se aparta ahí para que el tope no se rebase).
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

---

## App Check — cerrar `geminiProxy` a scripts ajenos

`geminiProxy` exige sesión iniciada, pero cualquiera puede crear una cuenta:
el límite real son 60 llamadas por hora y por usuario, así que quien abra
muchas cuentas puede quemar crédito de Gemini. App Check añade la
comprobación que falta —que quien llama sea *esta* app y no un script.

El código ya está integrado y **apagado por defecto**: mientras
`APPCHECK_SITE_KEY` (en `src/lib/config.js`) esté vacía, la app se comporta
exactamente igual. Para activarlo sin arriesgar el servicio:

1. **Registrar la app.** Consola de Firebase → *Compilación* → *App Check* →
   pestaña *Apps* → registra la app web con **reCAPTCHA v3**. Copia la clave
   de sitio.
2. **Ponerla en el código.** `APPCHECK_SITE_KEY = "6Lc..."` en
   `src/lib/config.js`, y publica el frontend. Es pública por diseño (viaja
   en el navegador, igual que el `apiKey` de Firebase); lo que protege es el
   secreto que se queda en Google.
3. **Observar antes de exigir.** En *App Check* → *APIs* verás cuántas
   llamadas llegan verificadas. Espera a que casi todo el tráfico real
   aparezca como verificado — si exiges antes, dejas fuera a usuarios con la
   versión vieja del sitio en caché.
4. **Exigir.** Cuando las métricas estén limpias, pulsa *Aplicar* en
   *Cloud Functions*. A partir de ahí, una llamada sin token válido se
   rechaza.

No hay prisa: el paso 4 se puede hacer días después del lanzamiento.

---

## Vigilar la facturación

El plan Blaze está activo mediante la **prueba gratuita de Google Cloud**.
Cuando se agote el crédito o venza el periodo, si no hay una cuenta de
facturación real enlazada el proyecto **cae a Spark y las Cloud Functions
dejan de responder** — es decir, se caen los cobros, la facturación, el
soporte con IA y los cinco agentes, todo a la vez.

Enlaza una cuenta de facturación real bastante antes de que venza, y revisa
el saldo de vez en cuando en la consola de Google Cloud → *Facturación*.
