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
