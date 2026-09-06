# Publicar Habilis en Google Play y App Store

El proyecto ya está empaquetado con Capacitor: `android/` e `ios/` son
proyectos nativos reales, no un atajo. Este documento dice qué está hecho,
qué falta y —lo más importante— **qué puede hacer que te rechacen**.

Nadie puede garantizar una aprobación. Lo que sí se puede es no dejar
ningún motivo de rechazo conocido sobre la mesa. Eso es lo que hay aquí.

---

## Lo que ya está resuelto

| Requisito | Estado |
|---|---|
| Proyecto nativo Android e iOS | Hecho (`npx cap sync`) |
| Identificador de la app | `com.habilis.app` |
| Borrar la cuenta desde dentro de la app | Hecho. Apple lo exige (guía 5.1.1 v) y Google desde 2024 |
| Aviso de privacidad accesible por URL | `myhabilis.com/privacidad` |
| Términos accesibles por URL | `myhabilis.com/terminos` |
| Textos de permiso en español y explicando el porqué | Hecho (micrófono, cámara, fotos) |
| Iniciar sesión con Apple | Ya existe, y es obligatorio porque ofrecemos Google |
| Declaración de cifrado no exento | Hecha en `Info.plist` |

---

## El bloqueo serio: el Plan Pro en iPhone

**Apple exige compras dentro de la app (In-App Purchase) para todo lo que
desbloquee funciones digitales dentro de la app**, y se queda entre el 15 %
y el 30 %. El Plan Pro desbloquea herramientas de IA y prioridad en las
búsquedas: eso cae de lleno en la regla 3.1.1. Cobrarlo por Mercado Pago
dentro de la app de iOS es rechazo casi seguro, y además está prohibido
enlazar al pago externo desde la app.

Tres caminos, y hay que elegir uno antes de enviar:

1. **Implementar IAP solo en iOS.** Se aprueba, y Apple se queda entre el
   15 % (primer millón de dólares al año) y el 30 % de cada $100 MXN. Hay
   que sincronizar dos fuentes de suscripción, la de Apple y la de Mercado
   Pago, con lo que eso implica en el webhook y en la facturación CFDI.
2. **Publicar en iOS sin venta.** La app de iPhone no muestra el Plan Pro
   en absoluto: el técnico se da de alta, documenta y usa lo gratuito. Si
   quiere Pro, lo contrata por su cuenta en la web. No se puede enlazar ni
   insinuar desde la app. Es lo que hacen muchas plataformas y no requiere
   pagar comisión.
3. **Solo Android por ahora.** Google Play también exige su facturación
   para bienes digitales, pero en México admite "facturación alternativa"
   con una reducción de comisión, y su revisión es menos estricta. Sale
   antes y con menos trabajo.

**Mi recomendación: empezar por Android, y para iOS ir por la opción 2.**
Sacas las dos tiendas sin ceder comisión y sin construir dos sistemas de
cobro. Cuando el volumen justifique la comisión, se añade IAP.

Esto es una decisión de negocio, no técnica: dime cuál eliges y lo dejo
implementado.

---

## Lo que tienes que hacer tú (no puedo hacerlo yo)

Nada de esto se puede automatizar desde aquí: requiere cuentas de pago,
identidad verificada y, para iOS, una Mac.

### Google Play
1. Cuenta de Play Console: **25 USD**, pago único.
2. Verificación de identidad. Si publicas como empresa, hace falta el acta
   de la S.A.P.I. y un número D-U-N-S. Como persona física es más rápido.
3. Generar la clave de firma y subirla (Play App Signing).
4. Rellenar el formulario de **Seguridad de los datos**. Declarar: correo,
   nombre, ciudad, fotos, audio del dictado, y que van cifrados en tránsito
   y se pueden borrar desde la app.
5. Clasificación de contenido, público objetivo y capturas.
6. URL de eliminación de cuenta: `myhabilis.com/completar-perfil` no sirve;
   apunta a `myhabilis.com/terminos` mientras no exista una página pública
   dedicada. **Si te la piden por separado, dímelo y la construyo.**

### App Store
1. Apple Developer Program: **99 USD al año**.
2. Una **Mac con Xcode** para compilar y subir. Sin eso no hay iOS. Como
   alternativa hay servicios de compilación en la nube.
3. Certificados y perfiles de aprovisionamiento.
4. Etiquetas de privacidad (equivalente al formulario de Google).
5. Decidir el camino del Plan Pro, arriba.

---

## Comandos

```bash
npm run build          # compila la web
npx cap sync           # copia la web a android/ e ios/
npx cap open android   # abre Android Studio
npx cap open ios       # abre Xcode (solo en Mac)
```

Después de **cada** cambio en la web hay que volver a correr `npm run build`
y `npx cap sync`, o la app nativa seguirá mostrando la versión anterior.

---

## Lo que falta antes de enviar

- [ ] Iconos y pantalla de arranque definitivos (hoy están los de Capacitor).
      Hacen falta en varias medidas; con el logotipo en alta resolución los
      genero.
- [ ] Elegir el camino del Plan Pro en iOS.
- [ ] Probar el dictado por voz en un teléfono real: el permiso de micrófono
      se comporta distinto dentro de la vista web de la app que en el
      navegador.
- [ ] Capturas de pantalla para ambas tiendas.
- [ ] Texto de la ficha: descripción, novedades y palabras clave.

---

# Cobrar el Plan Pro en App Store y Google Play

## Cuánto se llevan (México, septiembre 2026)

| | Comisión | Sobre $100 MXN te quedan |
|---|---|---|
| **Mercado Pago** (web) | ~3.5 % + IVA | ~$96 |
| **Google Play** | 15 % | $85 |
| **App Store** | 15 % | $85 |

Los dos 15 % no son el número de portada del 30 %:

- **Apple**: el *Small Business Program* baja al 15 % a quien facturó menos
  de 1 millón de USD el año anterior. Hay que **inscribirse a mano** en App
  Store Connect; no es automático. Si no te inscribes, pagas 30 %.
- **Google**: las suscripciones llevan 15 % desde el primer día. México
  **conserva el esquema actual hasta el 30 de septiembre de 2027**; el
  nuevo (10 % de servicio + 5 % de cobro, con opción de cobrar por tu
  cuenta) arrancó en junio de 2026 solo para Estados Unidos, Reino Unido y
  el Espacio Económico Europeo.

**Lo que esto significa:** cada suscriptor que entre por la app te deja
$85 en vez de $96. Son $11 al mes por técnico. No es un problema mientras
la mayoría se suscriba desde la web, y por eso la app cobra por la tienda
pero **la web sigue con Mercado Pago**: quien entra por myhabilis.com no
paga comisión de tienda.

## Cómo quedó montado

Los dos caminos terminan en el mismo `plan: "pro"` del técnico:

```
Web  → Mercado Pago  → webhookMP       ─┐
                                        ├→ tecnicos/{uid}.plan = "pro"
App  → App Store     → RevenueCat      ─┘
     → Google Play   → webhookTienda
```

`src/lib/tienda.js` decide cuál usar: `Capacitor.isNativePlatform()` es
`true` solo dentro de la app compilada. En el navegador de un teléfono
sigue mandando Mercado Pago.

Se usa **RevenueCat** en lugar de hablar con cada tienda por separado
porque la validación de recibos de Apple y la de Google no se parecen en
nada, y hacer las dos a mano es donde se pierde el dinero de verdad: cobros
que no activan el plan.

### Lo que ya está en el código

- Compra, restauración de compras (obligatoria en App Store) y lectura del
  precio **desde la tienda** — Apple rechaza las apps cuyo precio anunciado
  no coincide con el de la ficha.
- `webhookTienda` en el backend: alta, renovación, cancelación, caducidad y
  reembolso, con la cabecera de autorización comprobada.
- Cancelar: una suscripción de tienda **no se puede cancelar desde la app**
  (es una pantalla del sistema y hacerlo por tu cuenta es motivo de
  rechazo). La pantalla lleva a los ajustes correctos según el teléfono.
- Facturación: el CFDI solo se ofrece cuando cobró Habilis. Si cobró la
  tienda, el vendedor de cara al usuario es Apple o Google, y son ellos
  quienes emiten el comprobante y retienen el IVA. **Confírmalo con tu
  contador antes de lanzar**: cambia cómo se registra ese ingreso.

### Lo que falta para encenderlo

1. Crear la suscripción **$100 MXN/mes** en App Store Connect y en Play
   Console, con el mismo identificador de producto en las dos.
2. Cuenta de RevenueCat (gratis hasta 2 500 USD de ingreso mensual):
   conectar ambas tiendas y crear el *entitlement* llamado `pro`.
3. Poner las dos claves públicas en `src/lib/config.js`
   (`REVENUECAT_APPLE_KEY`, `REVENUECAT_GOOGLE_KEY`). Mientras estén
   vacías, la app no ofrece la compra y todo sigue por Mercado Pago.
4. Crear el secreto del webhook y apuntarlo a la función:
   ```
   firebase functions:secrets:set RC_WEBHOOK_SECRET
   ```
   Ese mismo valor va en RevenueCat → Integrations → Webhooks, en el campo
   Authorization header.
5. Inscribirte al **App Store Small Business Program**. Sin esto pagas el
   doble de comisión.
6. Probar con las cuentas de prueba (Sandbox en Apple, testers de licencia
   en Google) que la compra activa el plan y que cancelar lo retira al
   vencer.
