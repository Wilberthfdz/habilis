# INFORME DE PRODUCCIÓN — HABILIS
**Auditoría técnica de salida a producción · 13 estructuras revisadas · 3 de septiembre de 2026**

---

## 1. Veredicto

**No. Hoy no se puede lanzar cobrando.**

No es un "casi": hay tres familias de problemas que, por separado, ya justificarían detener el lanzamiento.

**1. Los datos personales de tus usuarios y de sus clientes están abiertos a internet.** Cuatro colecciones de Firestore permiten lectura sin restricción real: `cotizaciones` (con nombre, empresa, **RFC**, correo y teléfono de los clientes finales de cada técnico — gente que ni siquiera es usuaria de Habilis), `tecnicos` (con el correo de todos y su estado de suscripción), `solicitudes_chat` con sus `mensajes` (todas las conversaciones privadas de la plataforma, legibles con una cuenta gratuita creada en 30 segundos) y `servicios` (el historial de mantenimiento de Habilis Care, además **editable** por cualquier registrado). Esto no es teórico: la configuración de Firebase viaja en el bundle público y App Check está apagado (`src/lib/config.js:30`), así que basta un script. Es una brecha reportable ante el INAI, y el propio Aviso de Privacidad afirma lo contrario de lo que hace el código (`src/pages/Privacidad.jsx:84-89` frente a `firestore.rules:10, :67, :101-113`).

**2. Puedes cobrar dinero y no entregar nada — y no enterarte.** Un usuario sin perfil completo puede llegar a la pantalla de pago, pagar los $100, y el webhook falla en silencio con NOT_FOUND devolviendo 200 a Mercado Pago (`functions/index.js:582-589` y `:696-699`): suscripción viva, cero Pro, cero registro. Además, el endpoint que procesa los cobros mensuales recurrentes consulta `/v1/payments/{id}` cuando ese tópico se consulta en `/authorized_payments/{id}` (`functions/index.js:686-693`); si eso es así en producción, cobras todos los meses **sin poder emitir un solo CFDI** y sin ver los ingresos. Y hay caminos en los que el técnico queda Pro sin `suscripcionId`, con lo que el botón "Cancelar suscripción" le devuelve un error permanente mientras se le sigue cobrando (`functions/index.js:515-519`).

**3. Se está vendiendo lo que el producto no hace.** "4 leads garantizados al mes" no existe en una sola línea de código. El panel muestra tres clientes inventados (Roberto G., María T., Luis P.) escritos a mano en el código, con etiqueta NUEVO, a todos los técnicos, todos los días (`src/pages/PanelTecnico.jsx:322-341`). La "Posición en búsquedas" es el literal `#{esPro ? "1" : "8"}` (`PanelTecnico.jsx:375`) con un botón "Subir al #1 con Pro →" al lado. Y ningún beneficio Pro está realmente restringido: el límite de 5 trabajos del plan gratis no existe, las cotizaciones están abiertas, Habilis Care está abierto, la IA no consulta el plan. Cobrar $100 MXN/mes con esto en pantalla es publicidad engañosa en el sentido de los artículos 32 y 76 BIS de la LFPC — y es el hallazgo más fácil de probar de toda la auditoría, porque son dos literales en un archivo.

**La buena noticia:** casi nada de esto es arquitectura equivocada. Es cableado que falta. La plomería difícil —firma HMAC del webhook, idempotencia de pagos, transacción anti-doble-timbrado del CFDI, chat en tiempo real, aislamiento de los agentes de IA— ya está bien hecha. Lo que falta se puede cerrar en semanas, no en meses.

---

## 2. Lo que está bien

Esto es el activo real. No lo toques al arreglar el resto.

### Cobro y facturación: la parte más difícil ya está resuelta
- **El webhook no cree en lo que le mandan.** Toma solo el `id` y vuelve a preguntarle a Mercado Pago el estado real con el token propio antes de escribir nada (`functions/index.js:648-693`). Es el patrón correcto y evita que un POST falsificado active planes.
- **Firma verificada de verdad:** HMAC-SHA256 sobre el manifiesto id/request-id/ts con comparación en tiempo constante (`functions/mpFirma.js:36-61`), y con pruebas unitarias reales (`mpFirma.test.js`, `mpCheckout.test.js`).
- **Idempotencia real:** el cobro se guarda con id derivado del pago (`mp_${pago.id}`, `functions/index.js:621`) y `facturada` solo se inicializa al crear, así que una reentrega de Mercado Pago no vuelve a marcar como no facturado un cobro ya timbrado.
- **El CFDI se aparta dentro de una transacción antes de llamar a Facturapi y se libera si falla** (`functions/index.js:741-753`, `:780-781`). Eso cierra la ventana clásica de doble timbrado. Es la mejor pieza de código del proyecto.
- **El monto facturado sale del cobro real**, no de una constante (`functions/index.js:747`): un técnico con descuento recibe CFDI por lo que de verdad pagó.
- **La pantalla de retorno de pago** hace polling del plan durante ~60 s y a los 24 s cambia a un mensaje honesto con salida por correo (`SuscripcionPro.jsx:58-84`). Alguien pensó en el peor momento del producto: "ya pagué y no pasó nada".

### Seguridad: la segunda pasada de endurecimiento se hizo con criterio
- **La lista blanca de campos en `tecnicos`** (`firestore.rules:16-20`) usa `diff().affectedKeys().hasOnly([...])`, que es la forma correcta, y deja fuera `plan`, `verificado`, `rating`, `rankScore`, `suscripcionId`. Un técnico ya registrado **no** puede ascenderse solo. El equipo sabe hacer esto bien; el problema es que no lo aplicó en todas partes.
- **Todo el dinero es de solo lectura desde el navegador:** `pagos` solo admin, `facturas` y `suscripcionesPendientes` con `write: if false`, `rateLimits` cerrado por completo (`firestore.rules:141-168`).
- **`adminLogs` es append-only de verdad** (`firestore.rules:194-195`): ni el propio dueño puede editar el rastro de lo que hizo en el ERP. Eso es exactamente lo que hace falta cuando ese admin activa planes Pro a mano.
- **`clientes_tecnico`, `productos_tecnico` y `red_colaboradores` están correctamente aislados por dueño**, y las consultas están escritas para pasar las reglas (filtran por `tecnicoId`), que es donde casi todo el mundo falla.
- **La clave de Gemini nunca toca el cliente:** vive en Secret Manager y todo pasa por `geminiProxy` con sesión obligatoria.

### Agentes de IA: mejor arquitectura de la habitual
- **Escriben solo en campos con sufijo IA y nunca tocan `estado` ni `tipo`** (`functions/index.js:147-154`, `:302-306`). Una alucinación de Gemini ensucia metadatos, no el estado de un trabajo o de un pago. Es una disciplina deliberada y poco común.
- **No hay riesgo de bucle de agentes:** los tres triggers son `onDocumentCreated` y todas las escrituras de los agentes son `update`. La única cadena existente (Care → Matching) es de un solo salto. Ese es el fallo más caro de los sistemas con agentes y aquí está evitado.
- **Auditoría real y exportable:** `logDecision` escribe cada decisión en `aiLogs`, la colección es solo-lectura-admin, y AdminAgentes la muestra en vivo con exportación a CSV.
- **Los `fallback` del cliente mantienen la interfaz usable** cuando la IA falla, en vez de romper la pantalla.

### Producto y experiencia
- **Estados vacíos accionables y bien diferenciados:** "Aún no hay técnicos registrados" con CTA a registro vs "Sin resultados para X" con CTA a limpiar filtro (`Buscar.jsx:138-159`); lo mismo en panel, feed y campana.
- **La búsqueda y los perfiles funcionan sin sesión**, y el muro de login aparece solo al contactar. Es la decisión correcta para un marketplace: el cliente evalúa antes de registrarse.
- **El chat es tiempo real de verdad**, con dos `onSnapshot` y desmontaje correcto de los listeners (`Chat.jsx:38-57`). Los mensajes son inmutables por reglas.
- **La taxonomía es trabajo de dominio serio:** 17 categorías, 78 subcategorías, 354 especialidades, con referencias SINCO del INEGI y estándares CONOCER. Comprobado ejecutando el propio módulo. Y la función `coincide()` razona casos que casi nadie razona ("moto" contra "remoto").
- **El documento de cotización es un entregable presentable:** CSS de impresión, desglose de IVA, términos, y sale un PDF con `window.print()` sin ninguna librería.
- **Honestidad deliberada donde no hay datos:** en vez de inventar un 4.9, el perfil muestra `—` y el panel dice "Sin calificaciones aún". Contrasta con los bloques inventados y demuestra que el criterio existe.
- **Decisiones móviles correctas y comentadas:** `font-size:16px` para impedir el zoom de iOS, áreas táctiles de 44 px, compresión de imágenes en canvas antes de subir, límite de tamaño con mensaje en español.
- **`ErrorBoundary` real en todo el árbol**, y el ERP cargado con `lazy()` para que no pese en el bundle de nadie más.

### Legal: los textos están mejor escritos que el producto
- Los Términos deslindan relación laboral e intermediación de pagos (`Terminos.jsx:83-91`), **preservan expresamente los derechos irrenunciables del consumidor** en vez de intentar excluirlos (`:174-176`), y reconocen a PROFECO. La cláusula 3.3 sobre trabajos regulados (gas, media tensión) reconoce el riesgo más peligroso del negocio.
- La divulgación del uso de IA es honesta, nombra al proveedor real y es verificable contra `aiLogs`.
- La lista de encargados coincide exactamente con los proveedores que el backend usa. **No hay analítica ni rastreadores de terceros** en `index.html`. Eso es limpio y poco común.

---

## 3. Bloqueantes

Ordenados por gravedad. Todo esto tiene que estar cerrado antes de que entre el primer peso.

---

### B1 · Cuatro colecciones con datos personales abiertas a internet
**CRÍTICO — legal + seguridad**

**Qué pasa.** `allow read` sin restricción real en cuatro sitios:

| Colección | Regla | Qué se lleva quien lo pida |
|---|---|---|
| `cotizaciones` | `firestore.rules:67` — `read: if true` | Nombre, empresa, **RFC**, correo y teléfono del cliente de cada técnico, más precios, mano de obra y márgenes (`EditorCotizacion.jsx:37, :282-285`) |
| `tecnicos` | `firestore.rules:10` — `read: if true` | Correo de todos los técnicos, `plan`, `suscripcionId`, `fechaPago` (`Registro.jsx:45`, `functions/index.js:584-588`) |
| `solicitudes_chat` + `mensajes` | `firestore.rules:101-113` — solo `auth != null` | Todas las conversaciones privadas: nombres, problemas del domicilio, presupuestos, teléfonos |
| `servicios` (Care) | `firestore.rules:47-52` — solo `auth != null`, **incluye `update`** | Historial de mantenimiento de todos los clientes, con costos — y editable por cualquiera |

En Firestore `read` incluye `list`. No hace falta adivinar IDs: se enumera la colección entera. El `projectId` está en el bundle (`config.js:8`) y App Check está apagado (`config.js:30`), así que no hay ni una barrera blanda.

**Agravante en el chat:** `autorId` lo escribe el cliente (`Chat.jsx:99-105`) y nada exige que coincida con el usuario. Se pueden inyectar mensajes firmados como la otra persona **o como `autorId: "sistema"`**, que la UI pinta como aviso oficial de Habilis (`Chat.jsx:65-68`). Eso es un vector de fraude a nombre de tu marca: "deposita a esta cuenta". Y `allow update` deja a un tercero poner cualquier solicitud en `aceptado`, `rechazado` o `completado`, y escribir reseñas falsas en la conversación de un competidor.

**Qué se pierde si lanzas así.** Fuga de datos personales y fiscales de terceros que ni siquiera son tus usuarios. Es materia de denuncia ante el INAI, con obligación de notificar. La cartera de clientes y la estructura de precios de todos tus técnicos se descarga con una sola llamada — un competidor no necesita más. Y el Aviso de Privacidad que ya publicaste dice literalmente que hay "acceso restringido por reglas de seguridad", lo que convierte el incumplimiento en una afirmación falsa en un documento legal.

**Qué hacer.**
- `cotizaciones`: separar `get` de `list` — `allow get: if true; allow list: if false;`. Eso conserva el flujo de WhatsApp y mata la enumeración de golpe. Después, añadir un `token` aleatorio al documento en vez de usar el ID como secreto.
- `tecnicos`: sacar `email`, `suscripcionId`, `suscripcionEstado` y `fechaPago` a `tecnicos/{uid}/privado/datos` con regla de dueño+admin. La búsqueda no toca ese subdocumento y sigue igual.
- `solicitudes_chat`/`mensajes`: función `esParte(sid)` que compare `request.auth.uid` contra `clienteId` y `tecnicoId` del documento padre; en `mensajes`, exigir `autorId == request.auth.uid` y prohibir `tipo == 'sistema'` desde el cliente (que lo escriba una Cloud Function).
- `servicios`: `read`/`update`/`delete` solo si `resource.data.userId == request.auth.uid || isAdmin()`. El dato de dueño ya se escribe (`DetalleActivo.jsx:77`), la regla simplemente no lo usa.

**Esfuerzo:** minutos escribir las reglas, horas probarlas bien. Es lo primero que hay que hacer.

---

### B2 · Se puede pagar y no recibir nada, y nadie se entera
**CRÍTICO — dinero**

**Qué pasa.** Tres agujeros encadenados en el circuito del dinero:

1. **Pago sin perfil.** Quien entra con Google desde la tarjeta de precios va directo a la pantalla de suscripción sin pasar por completar perfil (`Login.jsx:39`), y esa pantalla muestra el botón de pago aunque `tecnico` sea `null` (`SuscripcionPro.jsx:179`). `crearSuscripcion` tampoco verifica que el documento exista (`functions/index.js:426-505`): crea la preaprobación y cobra. Cuando llega el webhook, `update()` sobre un documento inexistente lanza NOT_FOUND, el catch responde **200** (`functions/index.js:696-699`) y Mercado Pago da la entrega por buena y no reintenta.
2. **Los cobros mensuales pueden no registrarse nunca.** Todo el ciclo depende de `type === "subscription_authorized_payment"` consultando `mpGet('/v1/payments/${data.id}')` (`functions/index.js:686-693`). En las notificaciones de suscripción de Mercado Pago ese `data.id` identifica un *authorized payment*, que se consulta en `/authorized_payments/{id}`. Si el recurso no corresponde, `mpGet` devuelve `null`, la notificación se descarta en silencio y no queda documento en `pagos`. Sin documento en `pagos`, `emitirFactura` responde siempre "No tienes cobros pendientes de facturar" y AdminFinanzas muestra cero ingresos.
3. **No hay reintento ni conciliación.** El handler responde 200 pase lo que pase. No existe cola de fallidos ni tarea que compare las suscripciones activas en Mercado Pago contra la colección `pagos`.

**Qué se pierde.** Cobro recurrente vivo sin contraprestación, sin CFDI y sin visibilidad contable. En México eso no es un ticket de soporte: es reclamación, contracargo y expediente de PROFECO. Y los contracargos repetidos afectan tu cuenta de comercio en Mercado Pago.

**Qué hacer.**
- En `crearSuscripcion`, leer `tecnicos/{uid}` y lanzar `failed-precondition` si no existe, **antes** de tocar la API de Mercado Pago.
- Cambiar los `update()` de `functions/index.js:584, :592, :594, :641` por `set(..., { merge: true })`, para que un webhook nunca se pierda por documento inexistente.
- Condicionar el bloque de compra de `SuscripcionPro.jsx:179` a `tecnico` truthy y mandar a `completarPerfil` cuando sea `null`.
- Que el catch del webhook escriba el evento crudo en `webhooksFallidos` y responda 500 en error controlado para que Mercado Pago reintente.
- **Acción del dueño:** probar en sandbox un ciclo completo de suscripción recurrente y confirmar el endpoint correcto antes de abrir el cobro. Añadir un scheduler diario que liste las preaprobaciones autorizadas en MP y verifique que cada cobro tiene su documento en `pagos`, alertando de las diferencias.

**Esfuerzo:** horas el código, días con la prueba en sandbox y la conciliación.

---

### B3 · Cualquiera se regala Plan Pro y la insignia "Verificado" al crear su cuenta
**CRÍTICO — dinero + confianza**

**Qué pasa.** `firestore.rules:11` dice `allow create: if request.auth != null && request.auth.uid == uid;` — no valida ni un solo campo. El documento entero se escribe desde el navegador. Basta registrarse y, en lugar de dejar que la app envíe el payload, llamar `setDoc(doc(db,"tecnicos",uid), { plan:"pro", verificado:true, rating:5, totalTrabajos:200 })` desde la consola. La regla lo acepta.

La regla de `update` (líneas 16-20) sí está blindada, pero solo protege lo que pasa **después**. La creación es un agujero de una sola vez que basta para quedarse Pro para siempre — y como `allow delete: if isAdmin()`, ni siquiera se puede deshacer solo.

Los campos afectados no son decorativos: ordenan la búsqueda (`firebase.js:100-104`), puntúan el score (`Buscar.jsx:32-33`) y pintan las insignias "⚡ PRO" y "✅ Verificado" al cliente final.

**Qué se pierde.** Ingresos del único producto de pago, y —peor— la falsificación del sello de confianza sobre el que se construye toda la propuesta de Habilis. Un técnico sin un solo trabajo documentado aparece arriba de todos con ✅ Verificado. Si eso llega a un cliente en un trabajo de gas o media tensión, la responsabilidad reputacional es de la plataforma.

**Qué hacer.** Endurecer `firestore.rules:11` igual que ya se hizo en el update: exigir `plan == "gratis"`, `verificado == false`, `rating == 0`, `totalTrabajos == 0` y `hasOnly([...])` sobre el conjunto de campos permitidos. Alternativa más sólida: mover la creación a una Cloud Function `onCall` y poner `allow create: if false` desde el cliente. **Nota:** al hacerlo, añade `isAdmin() ||` porque hoy el botón "Crear técnico manualmente" del ERP falla siempre por esta misma regla (`AdminUsuarios.jsx:307`).

**Esfuerzo:** minutos.

---

### B4 · Escrituras sin lista blanca: la moderación y la reputación son falsificables
**ALTO — confianza**

Tres colecciones quedaron sin el tratamiento que sí recibió `tecnicos`:

**a) `trabajos` — el técnico anula el veredicto de la IA.** `firestore.rules:27` permite al dueño reescribir **cualquier** campo, incluidos `aprobadoIA`, `calidadIA`, `moderadoPorIA` y `razonModeracionIA`, que solo debería escribir el Admin SDK (`functions/index.js:176-183`). Un spammer marcado se auto-aprueba en una llamada y, como la cola del admin filtra por `aprobadoIA === false` (`AdminOperaciones.jsx:73`), **desaparece de la vista de revisión humana**. También puede ponerse "Calidad 10/10 revisado por IA", que es lo que se le muestra al cliente.

**b) `validaciones` — la reputación se fabrica desde la consola.** `firestore.rules:118` es `allow create: if request.auth != null`, sin verificar que `validadorId == request.auth.uid` ni que el validador no sea el dueño del trabajo. El ID lo compone el cliente (`firebase.js:356`) y la única barrera contra la auto-validación es una línea de JavaScript en el navegador (`Feed.jsx:51`). Mil validaciones inventadas sobre los propios trabajos son un `for` en la consola.

**c) `planes_care`.** `create` sin validar `clienteId` permite insertar un plan a nombre de otro usuario — y como la UI oculta la compra si ya existe un plan, eso es una **denegación de venta**. Y `update` sin restricción deja al propio usuario pasar su plan de `pendiente_pago` a `activo` o fijar `montoPagado` en 1 peso.

**Qué se pierde.** La moderación deja de ser moderación cuando el moderado controla el veredicto, y tu panel de admin muestra indicadores que no reflejan la realidad. La validación social es el activo que justifica cobrar y se falsifica en minutos: el tramposo aparece arriba del que trabaja bien.

**Qué hacer.** Aplicar el patrón que ya usas en `tecnicos`:
- `trabajos`: `hasOnly(['titulo','descripcion','problema','solucion','materiales','tiempoHoras','costoTotal','ciudad','evidencias','updatedAt'])` más `isAdmin()` para el override manual.
- `validaciones`: exigir `validadorId == request.auth.uid`, que el ID del documento sea `trabajoId + '_' + uid + '_' + tipo`, que `tipo` esté en la lista permitida, y que el `tecnicoId` del trabajo referenciado no sea el propio usuario. **Auditar y purgar las validaciones existentes antes de lanzar.**
- `planes_care`: `create` con `clienteId == request.auth.uid`; `update` restringido a nada que el cliente pueda tocar — `estado`, `montoPagado` y `tecnicoId` son escritura exclusiva del backend.

**Esfuerzo:** minutos.

---

### B5 · Se vende lo que el producto no hace
**ALTO — legal (LFPC art. 32 y 76 BIS) + confianza**

Esto es una decisión de negocio antes que un defecto técnico: hay que elegir entre **implementar** o **borrar el texto**. Lo que no puede quedarse es la mezcla actual.

| Promesa | Dónde se promete | Qué hay en el código |
|---|---|---|
| "4 leads garantizados al mes" | `Precios.jsx:18, :28` | Nada. Ningún contador, cuota, reparto ni compensación. El agente de matching trata el plan como desempate (`functions/index.js:119`) y además escucha una colección que el flujo real de solicitudes **no usa** |
| Tres solicitudes de clientes en el panel (Roberto G., María T., Luis P., etiqueta NUEVO) | `PanelTecnico.jsx:322-341` | **Un arreglo escrito a mano.** Idéntico para todos, no cambia nunca. Y el botón "Responder" hace `setTab("ia")`, no abre nada del cliente. Las solicitudes reales sí están cargadas en `solicitudesPend` y se ignoran |
| "Posición en búsquedas #1 / #8" + botón "Subir al #1 con Pro →" | `PanelTecnico.jsx:375-380` | El literal `#{esPro ? "1" : "8"}`. No se calcula nada |
| "Técnicos Verificados" (título del sitio, hero, buscar, cotizaciones) | `index.html:6`, `Landing.jsx:99, :427`, `Buscar.jsx:90` | `verificado` nace en false y solo lo cambia un botón manual del admin, sin criterio ni evidencia. El "agente Verificador" reescribe la bio, no verifica nada. El landing promete además un filtro por verificados que **no existe** |
| "Sin anuncios en tu perfil" (Pro) / "Con anuncios" (gratis) | `Precios.jsx:9, :16` | No hay sistema de publicidad en el proyecto. Quiénes Somos incluso presume "No vendemos anuncios" |
| "Prioridad en búsquedas" | `Precios.jsx:10`, `SuscripcionPro.jsx:123`, `PanelTecnico.jsx:244, :624` | `firebase.js:100-104` sí ordena Pro primero, pero en cuanto el cliente escribe algo, `Buscar.jsx:61` reordena por su propio score donde Pro vale +5 y cada año de experiencia +1. Un técnico gratis que declara 12 años supera a todo suscriptor Pro |
| Herramientas de IA del Plan Pro | `PanelTecnico.jsx:489-509` | Las tres tarjetas no tienen `onClick`. "Análisis de mercado" no existe en ninguna otra línea del proyecto. Para el que ya pagó, lo único que cambia es la opacidad |
| PlanCare: "Habilis asigna un técnico certificado", comisión 70/30, "garantía de 48 horas" | `PlanCare.jsx:96, :240-243` | El botón solo escribe un documento con `tecnicoId: null` y dice "Pago próximamente via Conekta" — y **Conekta no existe en el backend**; cobras por Mercado Pago. La colección `planes_care` no la lee ningún otro punto del sistema |
| Registro por voz de trabajos terminados | `ComoFunciona.jsx:22` | La grabación solo existe para llenar el perfil en la ruta de Google/Apple |
| "Cancelas cuando quieras desde Mercado Pago" (asistente de soporte) | `gemini.js:215` | El botón real está en /pro. Mandar al usuario a buscarla donde no está es el patrón exacto que PROFECO sanciona en cargos recurrentes |

**Qué se pierde.** Cada línea es una característica ofrecida y no entregada. En conjunto: prácticamente el 100 % de tus primeros suscriptores estará en supuesto de rescisión y bonificación desde el primer mes. Y el daño reputacional es peor que el legal: los electricistas y plomeros se comunican por WhatsApp, y el día que dos técnicos Pro comparen sus paneles y ambos vean "#1", la marca se quema en un gremio entero.

**Qué hacer.** Ir texto por texto y dejar solo lo que el código hace hoy. Concretamente y por orden:
1. Sustituir el arreglo falso del panel por `solicitudesPend.slice(0,3)` y que "Responder" haga `nav("chat", { solicitudId })` como ya hace la pestaña Solicitudes. **Minutos.**
2. Borrar la tarjeta de "Posición en búsquedas" o calcularla de verdad. **Minutos.**
3. Borrar "4 leads garantizados", "sin anuncios" y las dos tarjetas de IA muertas. **Minutos.**
4. Hacer que `plan === "pro"` sea el **primer criterio** del comparador, no un sumando, y acotar `experiencia` a 60 en el servidor. **Minutos.**
5. Decidir sobre "Verificado": o defines y publicas el criterio (INE cotejado, certificación cargada) y guardas la evidencia, o cambias el lenguaje a "técnicos con trabajos documentados" en las cinco pantallas. **Decisión del dueño.**
6. Decidir sobre PlanCare: o lo ocultas de la navegación hasta tener cobro y operación, o lo completas con el flujo de Mercado Pago que ya existe. En ambos casos, quitar "Conekta" y no prometer garantía de 48 h ni comisión 70/30 hasta que exista el proceso. **Decisión del dueño.**
7. Corregir el prompt del asistente en `gemini.js:215`. **Minutos.**

---

### B6 · Ningún beneficio del Plan Pro está realmente restringido
**ALTO — modelo de negocio**

**Qué pasa.** Beneficio por beneficio:
- **"Trabajos ilimitados" vs "hasta 5" del gratis** — el límite de 5 no existe. `RegistrarTrabajo.jsx` no lee `plan` en ninguna línea y la regla solo pide que el `tecnicoId` sea el propio (`firestore.rules:26`).
- **"Herramientas de IA con Gemini"** — `geminiProxy` solo verifica sesión y rate limit, jamás consulta el plan (`functions/index.js:372-382`). La única IA que sí funciona (sugerir respuesta) es gratis e ilimitada para todos.
- **"Generación de cotizaciones"** — el módulo se rotula "📋 Cotizaciones Pro" en su propio encabezado y **no tiene ninguna comprobación de plan** (`Cotizaciones.jsx:25`).
- **"Habilis Care"** — la ruta se sirve sin comprobación alguna (`App.jsx:172`).

Lo único que el pago cambia de verdad es el orden en búsquedas —que el propio score anula— y una insignia naranja.

**Qué se pierde.** No hay razón económica para pagar $100 MXN/mes. La conversión tenderá a cero, y quien pague y lo descubra pedirá su dinero de vuelta con razón. Es cobrar por algo que ya es gratis, y la app se lo demuestra al usuario en dos clics.

**Qué hacer.** Esto es una **decisión de negocio que hay que tomar antes de cobrar**, no un bug. Define qué es Pro y hazlo cumplir **en el servidor**, no en la UI: contar trabajos y rechazar el sexto en plan gratis, comprobar `plan === "pro"` en `geminiProxy` para los agentes exclusivos, y gate real (o freemium con tope) en Cotizaciones y Care. Lo que no vayas a restringir, **quítalo de la lista de beneficios**.

**Esfuerzo:** días.

---

### B7 · La reputación —el producto entero— nunca se acumula
**ALTO — propuesta de valor**

**Qué pasa.** Los tres campos que ordenan la búsqueda y que definen el producto no los escribe **ningún código**:
- `totalTrabajos` se inicializa en 0 (`firebase.js:66`) y nunca se incrementa. Ninguna de las 12 Cloud Functions lo toca. Es el término de **mayor peso** del ranking (`×2` en `functions/index.js:354` y en `Buscar.jsx:29`).
- `validaciones` **no existe como campo** del documento del técnico, y sin embargo puntúa `×1.5` en `Buscar.jsx:30`.
- `rating` se inicializa en 0 y las reglas impiden que el técnico lo escriba. La calificación que el cliente deja al final del chat se guarda dentro del documento de la conversación (`Chat.jsx:124-131`) y **ahí muere**: nadie la lee jamás.

Consecuencias visibles: la estrella nunca aparece en los resultados, "Calificación" en el perfil dice `—` para siempre, el landing etiqueta a todos como "Nuevo", y el `rankScore` que el agente calcula a diario para cada técnico **no lo lee la búsqueda** (Buscar recalcula el suyo en el cliente e ignora ese campo).

Además, el modal de calificación solo se abre si fue el **cliente** quien pulsó "completado" (`Chat.jsx:120`): si lo marca el técnico, al cliente nunca se le pide calificar.

**Qué se pierde.** El producto se llama "plataforma de reputación profesional" y ningún técnico podrá jamás tener una estrella. Un técnico con 40 trabajos y 5 estrellas queda igual que uno recién registrado; el desempate real acaba siendo la antigüedad del UID. El técnico bueno no percibe recompensa por documentar su trabajo — que es exactamente el comportamiento que la plataforma necesita para existir. Es la diferencia entre un directorio y una plataforma de reputación, y es lo que justifica cobrar.

**Qué hacer.**
- Trigger `onDocumentWritten` sobre `solicitudes_chat/{id}` que, al aparecer `review`, recalcule `rating` y `totalReviews` con el Admin SDK (validando que quien escribe es el `clienteId`). Guardar cada reseña en su propia colección para poder mostrarlas.
- `FieldValue.increment(1)` sobre `totalTrabajos` en el moderador cuando `aprobadoIA` sea true.
- Contador `validaciones` mantenido por un trigger sobre esa colección (elimina de paso el N+1 del feed).
- Hacer que `Buscar.jsx` **ordene por el `rankScore` que ya calcula el agente** en lugar de recalcular en el cliente. Así el orden es el mismo que ve el ERP y es auditable.
- Disparar el modal de calificación al cliente cuando entre a una conversación completada sin review, no solo en el momento del clic.

**Esfuerzo:** días.

---

### B8 · El descubrimiento está roto: techo de 100, chips que no encuentran a nadie, portafolios vacíos
**ALTO — producto**

Cuatro defectos que se refuerzan entre sí:

**a) Techo duro de 100 técnicos, y son 100 arbitrarios.** `buscarTecnicos` trae máximo 100 documentos **sin `orderBy`** (`firebase.js:93-96`), así que Firestore devuelve los primeros 100 por UID —una cadena aleatoria— y todo el filtrado y el orden Pro-primero ocurre después, en memoria, sobre esos 100. Simulado con 1000 técnicos: un Pro en la posición 873 no entra en el lote y buscar su oficio devuelve **0 resultados**. El fallo es silencioso: el usuario ve "Sin resultados", no un error. A ese técnico le estás cobrando $100 al mes por ser invisible.

**b) Los chips de oficio no encuentran a los técnicos dados de alta por correo.** Hay dos altas incompatibles: `Registro.jsx` guarda solo `oficio` como texto libre y **no guarda `categoriaId`**; `CompletarPerfil.jsx` sí. El filtro de `Buscar.jsx:47-48` solo casa por `categoriaId` o por `oficio.includes(consulta)`. Probado: **15 de 17 chips devuelven cero técnicos** del alta por correo. Al pulsar "Electricidad", un técnico con oficio "Electricista" no aparece, porque "electricista" no contiene "electricidad". La tarjeta "Cámaras CCTV" del landing devuelve 0 resultados **siempre**.

**c) Falta el índice compuesto de `trabajos`.** `where("tecnicoId","==")` + `orderBy("createdAt","desc")` (`firebase.js:127-133`) exige índice compuesto, y `firestore.indexes.json` solo declara índices de `pagos` y `facturas`. Y el fallo está silenciado: `Perfil.jsx:26` y `PanelTecnico.jsx:44` envuelven la llamada en `.catch(() => [])`. El cliente ve "Este técnico aún no ha registrado trabajos" y el técnico ve su panel vacío, aunque haya documentado veinte.

**d) "Solo mi estado" borra al técnico de las búsquedas por oficio.** El filtro de `Buscar.jsx:52-59` conserva al técnico solo si su **ciudad** contiene el texto buscado — pero el texto buscado casi siempre es un oficio. Verificado: dos electricistas idénticos en Mérida, uno con alcance "estado"; al buscar "electricista" solo aparece el otro. Y el perfil ni siquiera guarda un campo `estado`; la opción compara contra la ciudad.

**Qué se pierde.** El camino de descubrimiento principal devuelve listas casi vacías. El cliente concluye que Habilis no tiene técnicos; el técnico concluye que la plataforma no le trae trabajo y no renueva. Ambos lados se van por el mismo defecto. Y el técnico que configuró su perfil con cuidado (alcance estatal) es precisamente el que desaparece — con el panel diciéndole "Guardado".

**Qué hacer.**
1. Declarar en `firestore.indexes.json` el índice de `trabajos` (`tecnicoId` ASC, `createdAt` DESC) y desplegarlo. **Minutos.** Y cambiar los dos `.catch(() => [])` por un catch que distinga `failed-precondition` y lo reporte.
2. Añadir `orderBy("rankScore","desc")` a la consulta de búsqueda para que el corte de 100 sea al menos el top-100. **Minutos.** Después, mover el filtro al servidor (`categoriaId` + `ciudad_normalizada` con índices compuestos y paginación).
3. Reemplazar el `<select>` de 13 oficios de `Registro.jsx` por los mismos selectores de categoría/subcategoría de `CompletarPerfil.jsx`, y correr un backfill que mapee los perfiles existentes con `buscarPorTexto(oficio)`. Arreglar de paso `taxonomia.js:1376-1385` para que los resultados incluyan `categoriaId` (hoy el rescate por voz de `CompletarPerfil.jsx:71-75` es código muerto por eso).
4. Aplicar el filtro geográfico solo contra el campo de ciudad, no contra cualquier texto; y renombrar "Solo mi estado" a "Solo mi ciudad" o guardar el estado de verdad.

**Esfuerzo:** minutos lo urgente, días el filtrado server-side.

---

### B9 · Registro y sesión: cuentas huérfanas sin salida, y perfiles que no se pueden editar nunca
**ALTO — producto**

**a) El registro no es atómico.** `Registro.jsx:42-43` hace dos operaciones independientes: crea la cuenta en Auth (que ya deja sesión iniciada) y después escribe en Firestore. Si la segunda falla, queda una cuenta sin perfil — y **no hay forma de salir**: reintentar da "Ese correo ya está registrado"; ir al panel ofrece un botón "Completar registro" que lleva a `registro`, o sea al formulario que ya no puede funcionar (`PanelTecnico.jsx:135`); ir a Login rebota al panel (`Login.jsx:39`). El bucle solo se rompe si el usuario adivina que debe cerrar sesión. Y no hay red de seguridad: no existe ningún trigger de Auth en Cloud Functions.

**b) El redirect de Login pisa la comprobación de perfil.** `Login.jsx:39` navega en cuanto `user` deja de ser null, **sin pasar nunca por `routeAfterLogin`** (`:50-53`), que es justo la función escrita para decidir entre panel y completarPerfil. Eso produce parpadeos en el alta con Google, deja al usuario en el panel sin perfil si la lectura falla, y pierde la intención de compra de quien venía de "Obtener Plan Pro". Es también el mecanismo que hace alcanzable el pago sin perfil del B2.

**c) Nadie puede editar su perfil, nunca.** El botón "Editar perfil" del panel es literalmente `alert("Edición de perfil próximamente")` (`PanelTecnico.jsx:611`). Lo único modificable es la foto y el alcance. Nombre, oficio, ciudad, experiencia y biografía quedan congelados como se escribieron en el alta. Agravantes: los usuarios de **Apple quedan con el nombre público "Sin nombre"** (Firebase no rellena `displayName` en Sign in with Apple y `CompletarPerfil` no tiene campo de nombre), y el **agenteVerificador reescribe la biografía** con lo que devuelve Gemini (`functions/index.js:237-243`), guardando el original en `bioOriginal` — un campo que **no se lee en ningún punto del frontend**. Cuando la bio llega vacía (es opcional en el registro), se le pide al modelo que "transforme en un perfil profesional" una cadena vacía: el modelo inventa, y eso se publica como las palabras del técnico.

Y las reglas **ya permiten** editar nombre, oficio, ciudad, experiencia, bio, foto, alcance y disponible (`firestore.rules:19`). El helper `actualizarTecnico` ya existe y ya se usa. Solo falta el formulario.

**Qué se pierde.** El técnico que ya te dio todos sus datos se queda en la puerta, en el momento de máxima intención. El que se registró con un dedazo o se mudó tiene que escribir a soporte o crear otra cuenta perdiendo su historial. El de Apple aparece públicamente como "Sin nombre" en un producto de reputación. Y hay afirmaciones profesionales fabricadas por una IA publicadas a nombre de personas reales.

**Qué hacer.**
- Que "Completar registro" de `PanelTecnico.jsx:135` apunte a `completarPerfil`, no a `registro`. **Minutos.**
- En `Registro.jsx`, si falla la escritura del perfil pero `cred.user` existe, navegar a `completarPerfil`; y si `email-already-in-use` llega con sesión activa del mismo correo, saltar directo ahí.
- Sustituir el efecto de `Login.jsx:39` por uno que llame a `routeAfterLogin(user.uid)` y respete `quierePro` **solo cuando el perfil exista**; propagar la intención Pro a CompletarPerfil.
- Añadir un trigger `beforeUserCreated`/`onUserCreated` que cree un documento mínimo en `tecnicos`, para que el estado huérfano deje de ser posible.
- Construir la pantalla de edición reutilizando `CompletarPerfil.jsx` con `actualizarTecnico`, con campo "Nombre completo" obligatorio. Añadir "Restaurar mi texto original" que recupere `bioOriginal`, y que el agente **no escriba en `bio`** sino en `bioSugeridaIA` para que el técnico acepte o rechace. Saltarse el agente cuando la bio original tenga menos de ~40 caracteres.

**Esfuerzo:** horas lo urgente, días la pantalla de edición.

---

### B10 · El chat se pierde y el técnico nunca se entera de que le llegó una solicitud
**ALTO — producto**

**Qué pasa.**
- **El chat no es enlazable ni recuperable.** `RUTAS_URL` no incluye `chat`, así que el `solicitudId` vive solo en el estado de React. Un F5, cerrar la pestaña o el botón de atrás y la conversación desaparece. Y no hay bandeja: la única función que lista conversaciones filtra por `tecnicoId` (`firebase.js:341-343`), así que **el cliente no tiene ninguna pantalla donde ver sus solicitudes**. Peor para el técnico: su panel solo carga las de estado `pendiente` (`PanelTecnico.jsx:45`), así que en cuanto acepta, la conversación también desaparece de su panel. Resultado: después de aceptar, **ninguna de las dos partes puede volver a la conversación** salvo que hayan mantenido la pestaña abierta. En móvil, donde el navegador descarta pestañas constantemente, esto pasará casi siempre.
- **Nadie avisa al técnico.** `crearSolicitudChat` solo escribe el documento. No existe ningún trigger sobre `solicitudes_chat` en todo `functions/index.js`: sin notificación, sin correo, sin push. El técnico solo se entera si por casualidad abre su panel y recarga. Una solicitud marcada "Emergencia" puede quedarse en pendiente indefinidamente mientras el cliente ve para siempre "⏳ Esperando respuesta de X…".
- **Y cuando rechaza, la plataforma miente.** El mensaje dice "Habilis buscará otro técnico" (`Chat.jsx:91`), pero nada ni nadie busca otro: el agenteMatching escucha `solicitudes`, no `solicitudes_chat`.
- **El botón "Responder solicitud" del feed lleva a la pantalla equivocada.** El agenteMatching gasta una llamada a Gemini por solicitud, elige tres técnicos y les notifica "🎯 Nueva solicitud para ti"; el técnico entra al feed, pulsa "Responder solicitud" y el `onClick` navega a **`registrarTrabajo`** (`Feed.jsx:230-236`). No hay ninguna ruta desde una solicitud del feed hacia un chat.

**Qué se pierde.** El flujo central del producto —cliente contacta, técnico acepta, trabajo se completa— se rompe en el primer refresco. Los clientes concluirán que la plataforma perdió su solicitud y se irán a WhatsApp; el trabajo nunca se marca completado y nunca se genera reputación. Y estás pagando Gemini por un matching cuyo resultado no se puede ejecutar.

**Qué hacer.**
- Añadir `chat` a `RUTAS_URL` con el id en la ruta (`/chat/:id`) y leerlo al arrancar.
- Crear consulta por `clienteId` y pantalla "Mis solicitudes" para el cliente; listar también las aceptadas en el panel del técnico y convertir esa carga en `onSnapshot`.
- Trigger `onDocumentCreated` sobre `solicitudes_chat/{id}` que escriba en `notificaciones` para el técnico (la colección y la campana ya existen) y dispare correo en Emergencia/Urgente.
- Scheduler diario que marque como expiradas o reasigne las pendientes de más de 24-48 h.
- Que "Responder solicitud" cree o abra una `solicitudes_chat` entre el técnico y el `userId` de la solicitud. Si eso no va a existir para el lanzamiento, **quitar las solicitudes del feed y desactivar el agenteMatching** en vez de notificar acciones imposibles.
- Corregir el texto de `Chat.jsx:91` por lo que realmente ocurre.

**Esfuerzo:** días.

---

### B11 · Cotizaciones: el enlace que se manda al cliente cae en la portada, y el autoguardado borra la aceptación
**ALTO — dinero**

**a) El enlace de WhatsApp no abre nada.** Compartir genera `${origin}?vista=${cot.id}`, pero el router **solo inspecciona `pathname`** y no lee `window.location.search` en ningún punto del proyecto. El hosting reescribe todo a `/index.html`, así que el cliente ve la página de inicio de Habilis. La pantalla `vistaCotizacion` ni siquiera está en `RUTAS_URL`. **La ruta de ingreso completa del módulo no existe.**

**b) El autoguardado devuelve a borrador cualquier cotización aceptada.** El payload de `guardar()` incluye `estado:"borrador"` fijo (`EditorCotizacion.jsx:111`), y el autoguardado se programa a los 30 s con solo abrir el editor. Secuencia real: el técnico envía, el cliente acepta, el técnico abre la cotización para consultarla, y a los 30 segundos vuelve a `borrador`. Se pierde la única evidencia de que hubo aceptación y el monto desaparece del contador "Ingreso generado". La misma función además **reescribe el catálogo con el precio de esta cotización en cada guardado**: un precio rebajado a un cliente concreto queda como precio de catálogo para todos los presupuestos futuros.

**c) Se puede aceptar una cotización vencida o en borrador.** El bloque de aceptar se muestra si el estado es `enviada` **o `borrador`** y nunca consulta la variable `vencida` que se calcula justo arriba: el documento dice "VENCIDA" en rojo y dos centímetros más abajo ofrece el botón verde de aceptar, que funciona.

**d) Cuando el cliente acepta, nadie se entera.** `cambiarEstado` escribe solo `{estado}`. No hay notificación, ni correo, ni ninguna Cloud Function escuchando la colección. Y el mensaje que ve el cliente —"El técnico se pondrá en contacto contigo"— es una promesa que nada respalda.

**e) Ninguna escritura maneja errores.** Las tres operaciones usan `try/finally` **sin `catch`**: si el guardado falla, el spinner se apaga, no aparece mensaje y el técnico cree que guardó. Media hora de captura de partidas se evapora al cerrar la pestaña.

**Qué se pierde.** El módulo que vendes como diferenciador Pro no entrega nada al destinatario, y el técnico queda mal frente a su cliente con un enlace roto que él mismo envió. Cuando alguien sí acepte, el registro se destruye solo. En una disputa ("yo sí acepté esa cotización") no queda ningún rastro.

**Qué hacer.** En `screenInicial()` leer `URLSearchParams` y devolver `vistaCotizacion`; registrar la ruta como `/cotizacion/:id`. Quitar `estado` del payload de `guardar()`. Condicionar los botones a `estado === 'enviada' && !vencida` y reforzarlo en reglas. Añadir un `onDocumentUpdated` que notifique al técnico y guarde `aceptadaEn`/`aceptadaPorNombre`. Poner `catch` con error visible en las tres funciones. Y guardar en el catálogo solo con un botón explícito, no en cada autosave.

**Esfuerzo:** horas.

---

### B12 · El feed publica sin moderar, y publica datos de clientes que nunca consintieron
**ALTO — legal + reputacional**

**a) La moderación por IA hoy es decorativa.** El agente escribe `aprobadoIA: false` cuando detecta spam, insultos o contenido no técnico, pero **la consulta del feed no filtra por ese campo** (`Feed.jsx:17`), ni el perfil público. El único lugar donde el veredicto se usa es la tabla del admin. Cuesta dinero de Gemini, escribe un campo y no impide absolutamente nada. Y el documento es visible el instante en que se crea, con `allow read: if true` — legible sin sesión e indexable.

**b) Aceptar un chat publica el nombre y el problema del cliente en internet.** Cuando el técnico pulsa "Aceptar solicitud", se crea un documento en `trabajos` con `titulo: "Solicitud: <lo que escribió el cliente>"`, la descripción completa y `clienteNombre` (`Chat.jsx:74-85`). El feed lo muestra de inmediato con la etiqueta fija "🔧 Trabajo realizado" —aunque el trabajo ni haya empezado— y la línea "Cliente: <nombre>" (`Feed.jsx:127, :228`). El texto privado que el cliente escribió en un formulario que decía "Describe el problema que necesitas" termina publicado con su nombre, sin advertencia ni consentimiento. Descripciones tipo "se inunda el baño del departamento 4" quedan públicas.

**c) El formulario de trabajos pide "Cliente (opcional)" sin advertir que será público**, y las fotos antes/después son por definición imágenes del domicilio del cliente. **Y el técnico no puede borrarlas:** `allow delete: if isAdmin()`, no hay UI de edición ni borrado de trabajos en ninguna página. Si sube por error una foto con una placa o una fachada identificable, tiene que escribir a soporte. El Aviso de Privacidad, mientras tanto, promete "puedes editar o eliminar tu perfil directamente desde tu panel" (`Privacidad.jsx:81`).

**Qué se pierde.** Cualquiera con cuenta gratuita puede publicar texto e imágenes arbitrarias en una página pública con tu marca encima, y el sitio se vende como "moderación con IA". Un solo incidente de contenido ilegal o difamatorio es desproporcionado frente a lo que cuesta arreglarlo. Y el tratamiento de datos personales de un tercero sin aviso ni consentimiento, con derechos ARCO que no se pueden ejercer, es exposición directa bajo la LFPDPPP.

**Qué hacer.**
- Filtrar feed y perfil por `where('aprobadoIA','==',true)` con su índice compuesto, y que un trabajo no aprobado solo sea legible por su dueño y el admin. Fail-closed: crear el documento sin el campo y exigir `=== true`.
- Separar el expediente interno del portafolio público: campo `publicado: false` por defecto, o colección `expedientes` distinta para lo que nace del chat. Como mínimo inmediato, excluir del feed los documentos con `origen: 'chat'` y que la etiqueta refleje `post.estado`.
- Quitar `clienteNombre` de todo lo público o sustituirlo por iniciales; si se conserva, casilla de consentimiento explícita.
- Implementar borrado y edición para el dueño del trabajo, y actualizar `Privacidad.jsx` para declarar el tratamiento de datos de terceros y el carácter público de las evidencias.

**Esfuerzo:** horas lo urgente (el filtro y el `origen`), días el borrado y la reescritura legal.

---

### B13 · Habilis Care: dice "Al día" al equipo que lleva años sin mantenimiento, y publica datos privados sin permiso
**ALTO — producto + legal**

**a) La salud es falsa por defecto.** `calcularSalud` devuelve **100** en cuanto falta `ultimoMantenimiento` (`HabilisCare.jsx:19`), pero `calcularProxima` sí usa `fechaCompra` como base alternativa. Y ese campo es opcional en el alta, o sea que es el caso por defecto. Resultado en la misma tarjeta: anillo verde al 100 %, badge "Al día" y, dos líneas más abajo, "Vencido hace 2 154 días" **pintado en verde**. Verificado con datos reales del cálculo. Peor: el agente calcula su propio `saludScoreIA` que solo ve el admin, así que el cliente puede recibir la notificación "🔴 tu equipo necesita servicio" y al abrir la app ver 100 % "Al día".

**b) El agente publica solicitudes a nombre del usuario, decididas por un LLM.** Cuando Gemini devuelve `accionIA: "crear_solicitud"`, el agente escribe un documento en `solicitudes` con el nombre del equipo y el `userId` (`functions/index.js:319-332`), sin ninguna confirmación humana. `activos` es privada por reglas; `solicitudes` es **`allow read: if true`**. Un dato privado se convierte en anuncio público porque un modelo lo decidió. Y la decisión que se le delega es aritmética de fechas pura, con nada que valide la coherencia de la respuesta.

**Qué se pierde.** El módulo existe para avisar cuándo un equipo necesita servicio y hace exactamente lo contrario. Si un generador falla después de que la app lo declaró saludable, la contradicción queda visible en la propia pantalla del cliente. Y un agente autónomo publicando en internet, sin consentimiento, que el equipo de tal usuario necesita mantenimiento, es difícil de defender ante el INAI.

**Qué hacer.**
- Si no hay `ultimoMantenimiento` pero sí `fechaCompra`, calcular la salud desde la compra; si no hay ninguna, devolver `null` y mostrar "Sin datos · registra el último mantenimiento" en gris. Y decidir una sola fuente de verdad frente al agente. **Minutos.**
- Sustituir la creación automática por una notificación con botón: el agente propone, el usuario confirma. El flujo manual ya existe en `DetalleActivo.jsx:91-102`. Calcular el estado en código y dejarle a Gemini solo la redacción del mensaje —eso elimina de paso el costo por equipo/día y el timeout.
- Cambiar el `read` de `solicitudes` a `request.auth != null` como mínimo.

**Esfuerzo:** minutos la salud, horas el resto.

---

### B14 · App Check apagado y el límite de gasto de Gemini no es un límite
**ALTO — costo**

**Qué pasa.** `APPCHECK_SITE_KEY = ""` (`config.js:30`), así que la app se envía sin ninguna atestación — y el propio comentario del código describe el riesgo: *"Sin él, cualquiera con la URL de geminiProxy puede crear cuentas y quemar crédito de Gemini"*. El rate limit existe pero **no es transaccional**: `checkRateLimit` hace leer → filtrar → escribir fuera de una transacción (`functions/index.js:70-81`), así que diez peticiones simultáneas del mismo uid leen el mismo array y las diez pasan. Un `Promise.all` desde una pestaña lo rompe. Y el límite está atado al uid, con alta de cuentas gratuita, ilimitada y automatizable.

**Qué se pierde.** Cualquiera con un correo tiene un LLM de propósito general gratis pagado por Habilis: 4000 caracteres de entrada y 1024 tokens de salida por llamada, más una escritura en `aiLogs` por llamada. No hay techo global ni alerta de presupuesto: el gasto máximo es 60 × cuentas × 24 h. La primera señal será la factura de Google Cloud. En un negocio de $100 MXN/mes por técnico, un abusador es pérdida neta permanente. `transcribirRegistro` acepta además 15 MB de audio por llamada.

**Qué hacer.** En este orden:
1. Mover `checkRateLimit` a `runTransaction` o `FieldValue.increment` sobre un contador por ventana. **Minutos.**
2. **Acción del dueño:** generar la clave reCAPTCHA v3 en Firebase Console → App Check, ponerla en `config.js:30`, desplegar, verificar tráfico en Métricas y luego pulsar "Aplicar" en Firestore y Functions. Poner `enforceAppCheck: true` en `geminiProxy` y `transcribirRegistro`. Activar además la protección anti-abuso de Firebase Auth. **Es el arreglo más barato de toda la lista.**
3. Contador global diario que corte el servicio y notifique al admin al superar un presupuesto fijado.

**Esfuerzo:** minutos + una tarde de consola.

---

### B15 · Legal: el registro principal no muestra el aviso de privacidad, y los derechos ARCO no se pueden ejercer
**ALTO — LFPDPPP + LFPC**

**a) El registro por correo no recaba consentimiento.** `Registro.jsx` —la ruta a la que llevan **todos** los CTA del landing, el nav y la página de precios— no menciona en ningún punto los términos ni el aviso de privacidad. No monta el Nav, y una búsqueda de "termino|privacidad|acepta" en el archivo completo no devuelve nada. Sin embargo recoge nombre, apellido, correo, contraseña, ciudad, oficio, experiencia y descripción, y crea la cuenta que luego será cobrada. **La misma app sí lo hace bien en la otra ruta** (`CompletarPerfil.jsx:270-283`), así que el patrón existe y simplemente no se aplicó donde entra el 90 % de los usuarios. Y no se guarda ninguna prueba de aceptación: sin `aceptoTerminos`, ni fecha, ni versión.

**b) Los derechos ARCO son inejecutables.** El Aviso dice "puedes editar o eliminar tu perfil directamente desde tu panel". El panel solo tiene "Cerrar sesión", y `allow delete: if isAdmin()`. Ni siquiera por la vía manual: la herramienta del admin borra el documento de `tecnicos` y deja intactos trabajos, cotizaciones con datos de clientes, mensajes, validaciones, activos y el usuario de Auth. **No hay borrado en cascada ni exportación de datos.**

**c) Faltan datos obligatorios del responsable.** Ni Términos ni Aviso dan domicilio físico ni teléfono: solo "Cancún, Quintana Roo" y un Gmail. El artículo 16 fracción I de la LFPDPPP exige domicilio del responsable, y el 76 BIS fracción III de la LFPC exige domicilio y teléfono para reclamaciones **antes** de la transacción. Falta también la sección de "medios para limitar el uso o divulgación de los datos".

**d) No se verifica la edad mínima que los propios Términos exigen** ("al menos 18 años"), y el Aviso no menciona a menores en absoluto — en un producto donde los aprendices adolescentes son parte real del gremio y el perfil publica nombre, ciudad y fotos.

**Qué se pierde.** Sin aviso puesto a disposición al recabar los datos, el consentimiento no se perfecciona. Sin registro de aceptación, no tienes forma de probar ante nadie que el usuario aceptó los Términos: la limitación de responsabilidad, el deslinde del servicio técnico y toda la cláusula de pagos quedan sin base demostrable justo frente al usuario que decida discutirlos.

**Qué hacer.**
- Añadir en el paso 3 de `Registro.jsx` el mismo bloque con enlaces que ya usa CompletarPerfil, y persistir `aceptoTerminos: true`, `fechaAceptacion: serverTimestamp()` y `versionTerminos`. Guardar lo mismo en la ruta OAuth. **Minutos + minutos.**
- Añadir confirmación de mayoría de edad en el paso 1 y una sección de menores en el Aviso.
- **Acción del dueño:** publicar domicilio físico completo y teléfono/WhatsApp (el campo `whatsappSoporte` ya existe en AdminConfig pero no se publica), y añadir la sección de medios para limitar el uso de datos.
- Corregir `Privacidad.jsx:81` para que describa el mecanismo que sí existe (solicitud por correo, 20 días hábiles) **mientras** se implementa la Cloud Function `eliminarCuenta` con borrado en cascada.

---

### B16 · Cancelación: caminos sin salida, y retiro de beneficios ya pagados
**MEDIO-ALTO — dinero + contrato**

**a) Hay caminos en los que el técnico es Pro, se le cobra, y no puede cancelar.** `cancelarSuscripcion` exige `tecnico.suscripcionId` y aborta si falta (`functions/index.js:515-519`). Pero ese campo solo lo escribe la rama `authorized` de `aplicarEstadoSuscripcion`: el camino del pago recurrente activa el plan sin escribirlo (`:640-645`) y la activación manual del admin tampoco (`AdminFinanzas.jsx:142`). Basta con que se pierda una notificación de preaprobación —el handler la descarta en silencio si la firma no cuadra— para que el botón "Cancelar suscripción" devuelva un error permanente. La página de precios promete lo contrario: "Cancelas desde tu página de suscripción cuando quieras".

**b) Al cancelar se retiran los beneficios en el acto**, contra lo que dicen los Términos ("conservas los beneficios hasta el fin del periodo pagado", `Terminos.jsx:148`), la FAQ de Precios y la de Soporte. `cancelarSuscripcion` escribe `plan:"gratis"` inmediatamente (`functions/index.js:532-535`). Combinado con la cláusula 4.2 que dice que no hay reembolsos por periodos parciales, el resultado es el peor posible: quien cancela el día 2 pierde el servicio ese día y no tiene derecho a reembolso.

**Qué se pierde.** Cobros recurrentes que el usuario no puede detener por el canal que se le prometió — la queja que escala sola a la aclaración bancaria y al contracargo. Y un incumplimiento del contrato que tú mismo publicaste, con dinero de por medio.

**Qué hacer.** Escribir `suscripcionId` en **todos** los caminos que activan Pro; y como respaldo, que `cancelarSuscripcion` busque la preaprobación activa en Mercado Pago por `external_reference == uid` cuando el campo falte, en vez de rendirse. Nunca dejar que la ruta de cancelación termine en un callejón sin salida.
Para (b): guardar `finPeriodoPagado` y degradar con un scheduler diario. **Alternativa de minutos si no da tiempo:** corregir Términos, FAQ y el diálogo para decir la verdad ("el acceso Pro termina al cancelar"). Lo que no puede quedarse es las dos versiones conviviendo.

---

### B17 · ERP: la identidad de admin cuelga de un correo sin verificar, y el panel cobra de más y de menos
**ALTO — control del negocio**

**a) `isAdmin()` compara `request.auth.token.email` contra tu correo y nada más** (`firestore.rules:6`). No exige `email_verified == true` ni usa custom claims. Si el proyecto tiene desactivado "un solo usuario por correo" —es una casilla de la consola, no está en el repo—, cualquiera puede registrar tu correo con contraseña propia y obtener **control total de Firestore**: pagos, facturas con RFC, borrado de técnicos, regalar Pro. Además el correo está codificado en tres archivos, lo que le dice al atacante exactamente qué cuenta atacar.
**Arreglo mínimo inmediato:** añadir `&& request.auth.token.email_verified == true`. **Lo correcto:** custom claim `admin == true` puesto con el Admin SDK, revocable sin desplegar nada.

**b) El panel escribe `plan` a mano sin tocar Mercado Pago.** Quitar Pro o suspender pone `plan:'gratis'` (`AdminUsuarios.jsx:67`) pero el preapproval sigue vivo y **se sigue cobrando $100 cada mes**; y cuando llegue el webhook del siguiente cobro, `registrarPagoSuscripcion` vuelve a poner `plan:'pro'` y **deshace en silencio tu decisión**. Al eliminar un técnico se borra el perfil, no la suscripción. Del otro lado, el pago manual activa Pro con `fechaPago` — un campo que **no se lee en ninguna parte** y sin ningún scheduler que degrade: un cobro único en efectivo compra Pro **para siempre**.

**c) Suspender es reversible por el propio suspendido en un toque.** Lo único que saca al técnico del buscador es `disponible`, y las reglas permiten al dueño del perfil actualizar ese campo (`firestore.rules:19`). El campo `suspendido` no se consulta en ningún archivo fuera de `src/pages/admin`. La sanción más fuerte del panel es un placebo.

**Qué hacer.** `email_verified` ya. Que el panel no escriba `plan` directamente: una Cloud Function admin que cancele el preapproval al quitar Pro/suspender/eliminar, y que al conceder Pro manualmente escriba `proAsignadoHasta` con fecha límite que un scheduler revise. Filtrar por `suspendido != true` en la consulta pública y en el agente de matching.

---

### B18 · Navegación sin URLs: el botón atrás saca de la app y ningún perfil se puede compartir
**ALTO — producto + adquisición**

**Qué pasa.** `RUTAS_URL` (`App.jsx:119-123`) lista ocho pantallas y no incluye `buscar`, `perfil`, `chat` ni `cotizacion`. Y **no existe un solo listener de `popstate` en todo el proyecto**. Dos fallos distintos:
- En las pantallas sin URL —que son la mayoría— no se apila nada en el historial: el primer toque de "atrás" **saca al usuario del sitio**. En Android el botón atrás es físico y se usa constantemente.
- En las que sí tienen URL, se apila pero nadie la escucha: la URL y la pantalla quedan desincronizadas.

Consecuencia comercial: el perfil de un técnico **no tiene dirección**. No hay ningún `<a href>` de navegación interna en todo `src/`, ni `robots.txt`, ni `sitemap.xml`, y todas las pantallas comparten el mismo `<title>` y las mismas etiquetas `og:`.

**Qué se pierde.** El canal natural de este gremio es mandar un enlace por WhatsApp: "mira mi perfil, ahí están mis trabajos con fotos". Hoy es imposible — y eso es literalmente lo que el técnico compró al pagar $100 al mes. Google no puede indexar ni un solo perfil, así que Habilis nunca aparecerá en "electricista en Mérida": renuncias por completo a la adquisición orgánica. Y en móvil, la app "se cierra sola" decenas de veces al día por usuario.

**Qué hacer.** Extender `RUTAS_URL` a todas las pantallas con parámetro (`/tecnico/:id`, `/chat/:id`, `/cotizacion/:id`, `/buscar?oficio=&ciudad=`), leerlas en `screenInicial`, guardar `params` en el estado del `pushState` y suscribirse a `popstate`. Convertir las tarjetas de técnico en `<a href>` reales. Actualizar `document.title` y las `og:` por pantalla. El prerender para la vista previa de WhatsApp puede esperar; **el enlace compartible y el botón atrás no**.

**Esfuerzo:** horas el atrás y las rutas, días el SEO/prerender completo.

---

## 4. Importante, no bloqueante

Semana 1-2 después del lanzamiento.

**Confianza y cobro**
- **No existe verificación de correo** en ninguna parte del producto (`sendEmailVerification` y `emailVerified` no aparecen en `src/` ni en `functions/`). Ese correo sin confirmar es el que se propone como correo de cobro en Mercado Pago y el que acaba en el CFDI. Se puede lanzar sin bloquear el registro, pero **no se debería cobrar a una cuenta sin verificar** (comprobable server-side con `request.auth.token.email_verified`).
- **El CFDI se emite siempre con `payment_form: "28"` (tarjeta de débito)** (`functions/index.js:772`), aunque el ERP registre efectivo, transferencia u Oxxo y Mercado Pago cobre a crédito. `registrarPagoSuscripcion` ni siquiera guarda el método real. Cada comprobante con forma de pago equivocada es una deducción que le pueden rechazar a tu técnico. Guardar el método real y mapearlo al catálogo del SAT.
- **No hay factura global mensual** por las operaciones de público en general. Decisión con el contador; puede hacerse fuera de la app al principio, pero tiene que estar calendarizado.
- **Recuperación de contraseña**: el correo sale de `noreply@…firebaseapp.com` con plantilla por defecto (parece phishing y penaliza la entregabilidad), no se puede reintentar sin recargar la página, y para una cuenta de Google devuelve un mensaje genérico que no explica nada. Es el único camino de vuelta para alguien que paga $100 al mes.
- **Google y Apple Sign-In dependen de configuración externa no documentada**, y si falta, el usuario final ve textos de administrador: "Agrega el dominio en Firebase Console → Authentication → Authorized domains" (`Login.jsx:74-79`). Cambiar por mensajes genéricos y ocultar el botón de Apple si el alta en Apple Developer no está hecha. Ojo también con `authDomain` en `firebaseapp.com` mientras sirves desde myhabilis.com: Safari ITP ya restringe eso y Chrome lo está retirando.

**Fiabilidad**
- **La moderación falla en abierto.** `parseJsonLoose` devuelve `{aprobadoIA: true, calidadIA: 5}` como respaldo (`functions/index.js:168-174`), y `callGemini` devuelve cadena vacía justo cuando el filtro de seguridad de Gemini bloquea la generación por contenido violento o de odio. Es decir: **el contenido que Gemini se negó a procesar es el que queda aprobado automáticamente**, y al técnico se le notifica una "calidad 5/10" que nunca se calculó. Cambiar a fail-closed con `revisionPendiente: true` y subir `maxTokens` a ~500.
- **Los triggers no reintentan.** Cualquier 429 o 503 de Gemini descarta el evento para siempre: trabajo sin moderar, solicitud sin asignar, técnico nuevo sin score, sin cola ni alerta. Envolver en try/catch, escribir `analisisIAFallido: true` y activar `retry: true` con guarda de idempotencia. **Y en agenteCare es peor:** la llamada está dentro del `for` sin try/catch, así que un solo activo que falle **aborta el día entero**.
- **agenteCare no cabe en 60 segundos.** Lee todos los activos sin límite con una llamada a Gemini secuencial por equipo: se corta a las pocas decenas. Y como el orden es estable por id, **cada día se reprocesan los mismos primeros N y la cola no se analiza nunca**. Paginar con cursor, `timeoutSeconds: 540`, y marca `ultimoAnalisisIA`. Igual para agenteRanking (escrituras sueltas → `db.batch()` de 500).
- **`solicitudAutoCreada` nunca se limpia:** cada equipo genera **una única** solicitud automática en toda su vida. Es el mecanismo por el que Care alimenta de trabajo al marketplace. Sustituir por una fecha.
- **El agente notifica todos los días por el mismo equipo**, sin dedupe ni enfriamiento. Es la vía más rápida a que el usuario silencie todas las notificaciones de Habilis, incluidas las de pagos y mensajes.
- **Errores silenciosos por todas partes.** `Landing.jsx:252` termina en `.catch(() => {})`, `Buscar.jsx:24` vacía las listas, `Feed.jsx:17-18` devuelve arrays vacíos. Efecto compuesto: **si Firestore cae o falta un índice, la portada le dice al visitante "Sé el primero en registrarte"**. Un fallo total del backend se presenta como un producto que funciona pero está vacío, y nadie del equipo se entera. Lo mismo en Chat (mensaje que se borra del textarea antes de escribir, sin catch), Care y Cotizaciones.
- **Instalar un reportador de errores de cliente antes de cobrar el primer peso.** Sentry tiene plan gratuito suficiente para este volumen; engancharlo en `componentDidCatch`, `window.onerror` y `unhandledrejection`. Hoy vas a cobrar suscripciones a ciegas.

**Producto**
- **La campana deja de mostrar notificaciones nuevas al pasar de 50** (`limit(50)` sin `orderBy`, `firebase.js:385-391`): a partir de la número 51 se devuelve siempre el mismo subconjunto arbitrario. Un técnico activo cruza ese umbral rápido y deja de enterarse de las solicitudes. Añadir `orderBy("fecha","desc")`. Además **se monta dos veces** (`Nav.jsx:146` y `:170`) y consulta cada 60 s: ~48 000 lecturas diarias por técnico con la pestaña abierta. Montar una sola vez y sustituir el `setInterval` por `onSnapshot`, que es más barato y además da tiempo real.
- **El historial de servicio de Care se corta en 20 registros arbitrarios** (limit sin orderBy) y el contador que se muestra al usuario se queda clavado en 20 para siempre.
- **No hay forma de editar ni eliminar un equipo en Care** (`eliminarActivo` existe pero no lo llama ninguna pantalla): un equipo dado de alta mal queda para siempre contando en las estadísticas, consumiendo Gemini y notificando.
- **El botón "Duplicar" de cotizaciones falla siempre** (`id: undefined` sin `ignoreUndefinedProperties`) y además **quema un folio en cada intento**, dejando huecos inexplicables en la numeración.
- **Los folios pueden colisionar:** `getDoc` + `setDoc` sin transacción. Dos cotizaciones con el mismo número a dos clientes distintos.
- **El documento que ve el cliente muestra importes con tres decimales** ("$1,159.988") y **fechas corridas un día** (parseo UTC de `YYYY-MM-DD`). Es el único documento que ve tu cliente final.
- **Se pierde una foto en silencio** si se guarda un trabajo durante el procesado (`'__loading__'` se descarta sin avisar), y las etiquetas ANTES/DESPUÉS se invierten si solo se sube la del después.
- **La subida de foto de perfil se puede colgar para siempre** (promesa sin `reject`, sin `onerror`): HEIC de iPhone, archivo corrupto → spinner eterno sin mensaje, y no se puede reintentar con el mismo archivo.
- **Fallos de red en la portada se presentan como plataforma vacía**, y el landing no tiene bandera de carga, así que **todo visitante ve "no hay técnicos" durante el tiempo que tarda Firestore**.
- **Cero moderación y cero forma de reportar en el chat**, sin límite de tamaño de mensaje. Es un canal 1:1 entre desconocidos que después quedan de verse en un domicilio, y los Términos afirman que "Habilis utiliza moderación asistida por inteligencia artificial". Añadir límite de tamaño en la regla y un botón "Reportar conversación".
- **El envío masivo del ERP dispara sin confirmación, sin lotes y sin quedar en la bitácora**, y con el filtro de ciudad vacío va a todos los que no tienen ciudad capturada. Un clic accidental es irreversible.
- **Los códigos promocionales no se pueden desactivar ni corregir desde el panel.** Si uno se filtra o se captura mal (90 % en vez de 9 %), hay que entrar a la consola de Firebase mientras se siguen creando suscripciones con ese descuento.
- **Contraste por debajo de WCAG AA en el CTA principal:** `#F97316` con texto blanco da **2.80:1**, y el placeholder da **1.82:1**. No es un tema teórico para este público: tus usuarios usan el teléfono a pleno sol. `#C2410C` da 4.6:1 y mantiene la identidad naranja.
- **Las reglas CSS de adaptación a móvil no se aplican nunca** (`App.jsx:60`): el selector busca `gridTemplateColumns` en el atributo `style`, que el navegador serializa en kebab-case. Son código muerto, y de ellas dependían 23 rejillas — incluidos **"Nombre / Apellido" y "Oficio / Ciudad" del registro**, que en un teléfono de 360 px quedan con ~110 px por campo. Es traicionero porque quien lo escribió cree que la app es responsiva.

---

## 5. Deuda asumible

Cosas que conviene saber que existen, sin urgencia inmediata.

- **Fotos en base64 dentro de Firestore.** El motivo declarado ("no Blaze plan needed", `firebase.js:5`) ya no aplica: usas Functions v2 con salidas a Gemini y Mercado Pago, que exigen Blaze. Las reglas de Storage **ya están escritas y sin usar** (`storage.rules:15-20`). Consecuencias: evidencia a 400 px calidad 0.5 que no demuestra nada en el producto cuya propuesta es "evidencia real"; la portada descarga hasta 100 perfiles completos con fotos para pintar 4 tarjetas (`Landing.jsx:252`); el feed trae 30 trabajos con base64 y dispara 30 consultas de validaciones en paralelo; y **la consola de moderación carga la colección `trabajos` completa sin límite**, así que dejará de abrir justo cuando más la necesites. Migrar a Storage sube la calidad, baja el costo ~7x por GB y quita el 33 % de sobrepeso del base64.
- **Bundle único de 992 KB** con las 26 páginas importadas estáticamente y `taxonomia.js` (63 KB) dentro, sobre un `index.html` que no pinta nada hasta que el bundle se ejecuta. Varios segundos de pantalla en blanco en 3G — incluido el regreso desde Mercado Pago. `lazy()` en todas las páginas del `switch` es casi mecánico porque el `<Suspense>` ya está montado.
- **El ERP descarga colecciones completas sin paginar** en cada carga (dashboard: tecnicos + trabajos + activos + 500 aiLogs + 500 pagos). No rompe hoy; es la clase de deuda que se paga justo cuando el negocio empieza a funcionar.
- **`aiLogs` crece sin caducidad** (una entrada por activo por día) y `fieldOverrides` está vacío: sin política TTL configurada.
- **Dos de los cinco agentes no llegan al producto real.** agenteMatching escucha `solicitudes`, colección que el flujo principal de contacto **no usa** (escribe en `solicitudes_chat`). agenteRanking escribe `rankScore` que la búsqueda ignora, y encima agenteVerificador lo escribe en escala 0-100 mientras el ranking lo pisa con otra escala. Decidir cuál es la colección canónica, y o Buscar pasa a ordenar por `rankScore` o se apaga el agente. Tener las dos a la vez solo produce confusión y gasto.
- **Las guardas "evita reprocesar" no protegen contra la reentrega del evento** (leen el snapshot original), y el moderador directamente no tiene ninguna. Riesgo: notificaciones duplicadas y coste doble de Gemini.
- **`transcribirRegistro` ignora el error de Gemini** y devuelve un perfil vacío como si hubiera funcionado, dejando además un registro de auditoría falso. En una función pensada para quien no quiere escribir, ese es el momento exacto en que abandona.
- **De los 449 nodos de la taxonomía, las 354 especialidades, `MARCAS` y `CERTIFICACIONES` no se usan en ninguna parte.** El perfil solo guarda dos niveles y `especialidadId` no aparece en ningún archivo. Duele especialmente en CERTIFICACIONES, cuyo propio comentario dice "este es el diferenciador de Habilis". Es trabajo de dominio ya pagado del que no cobras el beneficio: no se puede filtrar "chiller enfriado por agua" ni "certificado Carrier", que es justo la búsqueda de alto valor donde no compites con Facebook Marketplace.
- **El "Alcance LATAM" se etiqueta como Plan Pro, no está restringido a Pro y no hace nada** (`Buscar.jsx:53` trata `latam` igual que `nacional`).
- **El campo "Precio plan Pro" del ERP no cambia lo que se cobra:** `crearSuscripcion` tiene `let monto = 100` fijo y nunca lee `config`. Lo mismo con "modo mantenimiento" y "registro abierto", que no se leen en ningún archivo. Un panel que promete lo que no hace es peor que un panel sin la función.
- **"Crear técnico manualmente" del ERP genera perfiles huérfanos** con ID aleatorio que **reciben solicitudes reales del agente de matching** y nadie las abre nunca, además de inflar el contador de usuarios del reporte. (Hoy además la regla lo rechaza siempre — ver B3.)
- **El reporte financiero mezcla periodos:** ingresos de 6 meses menos gastos históricos completos, y el KPI "TOTAL HISTÓRICO" se calcula sobre `limit(500)`. El tipo de cambio a dólares es la constante 18.5. Ese número se exporta como evidencia a terceros.
- **Accesibilidad:** un solo `aria-*` en el proyecto, cero `htmlFor`, cero `role=`. Formularios sin etiqueta programática, tarjetas de técnico como `<div onClick>` inalcanzables por teclado, modales sin `role="dialog"` ni cierre con Escape.
- **El expediente creado desde el chat nace con estado `pendiente`** aunque se pase `en_proceso`, porque `crearTrabajo` fija el estado después del spread (`firebase.js:110-111`).
- **La identidad fiscal del emisor no coincide con el contrato:** los Términos nombran a "Habilis Tecnology, S.A.P.I. de C.V., sociedad en proceso de constitución", así que el CFDI lo emitirá un contribuyente distinto. Aclararlo en Términos y Aviso para que el nombre del CFDI no sorprenda.

---

## 6. Plan de ataque

### Fase 0 — Antes de nada: cerrar las puertas (1-2 días, desarrollador)

**Reglas de Firestore (minutos cada una, todas juntas en un despliegue):**
1. `cotizaciones`: `allow get: if true; allow list: if false;`
2. `solicitudes_chat` + `mensajes`: función `esParte()`, `autorId == request.auth.uid`, prohibir `tipo == 'sistema'` desde el cliente
3. `servicios`: scope por `userId`
4. `validaciones`: `validadorId == uid`, ID compuesto verificado, `tipo` en lista, prohibir auto-validación
5. `trabajos` update: `hasOnly([...])` sin los campos `*IA`, más `isAdmin()`
6. `tecnicos` create: validar `plan == "gratis"`, `verificado == false`, `rating == 0`, `totalTrabajos == 0`, `hasOnly([...])`, más `isAdmin() ||`
7. `planes_care`: `clienteId == uid` en create, `update` cerrado
8. `solicitudes`: `read: if request.auth != null`
9. `isAdmin()`: añadir `email_verified == true`

**Índices (minutos):** declarar `trabajos` (`tecnicoId` ASC, `createdAt` DESC) y `solicitudes` (`ciudad`, `estado`, `createdAt`) en `firestore.indexes.json` y desplegar con `--only firestore:indexes`.

**Rate limit (minutos):** `checkRateLimit` a `runTransaction`.

### Fase 1 — Borrar lo que no es cierto (medio día, desarrollador + decisiones del dueño)

Todo esto son ediciones de minutos, pero cada una necesita que el dueño confirme la decisión:

| Cambio | Archivo |
|---|---|
| Sustituir las 3 solicitudes falsas por `solicitudesPend.slice(0,3)` y arreglar "Responder" | `PanelTecnico.jsx:322-341` |
| Borrar la tarjeta "Posición en búsquedas" (o calcularla) | `PanelTecnico.jsx:368-382` |
| Borrar "4 leads garantizados" + su FAQ | `Precios.jsx:18, :28` |
| Borrar "Sin anuncios"/"Con anuncios" (también en Soporte y en el prompt de gemini) | `Precios.jsx:9, :16`; `Soporte.jsx:7`; `gemini.js:215` |
| Borrar las 2 tarjetas de IA muertas o conectarlas | `PanelTecnico.jsx:489-509` |
| Corregir instrucción de cancelación del asistente | `gemini.js:215` |
| Ocultar PlanCare o quitar "Conekta", comisión 70/30 y garantía 48 h | `PlanCare.jsx:96, :211, :226, :240-243` |
| Añadir bloque legal + `aceptoTerminos` en el paso 3 del registro | `Registro.jsx` |
| Decidir: corregir Términos/FAQ sobre cancelación, o implementar `finPeriodoPagado` | `Terminos.jsx:148`, `Precios.jsx:26`, `Soporte.jsx:10` |
| Decidir: cambiar "Verificados" por "con trabajos documentados", o definir el criterio | `index.html:6`, `Landing.jsx:99, :427`, `Buscar.jsx:90`, `QuienesSomos.jsx:27` |
| Cambiar mensajes de error de Google/Apple por texto genérico | `Login.jsx:74-79` |
| Ordenar Pro primero como criterio, no como sumando; acotar `experiencia` | `Buscar.jsx:28-33, :61` |
| Salud de Care desde `fechaCompra`, o `null` con estado "Sin datos" | `HabilisCare.jsx:18-27` |
| "Completar registro" → `completarPerfil` | `PanelTecnico.jsx:135` |
| `orderBy("rankScore","desc")` en la búsqueda (parche del techo de 100) | `firebase.js:96` |
| Moderación fail-closed + `maxTokens` a 500 | `functions/index.js:168-174` |

### Fase 2 — El dinero (2-4 días, desarrollador + prueba en sandbox)

1. `crearSuscripcion`: exigir que exista `tecnicos/{uid}`; `SuscripcionPro.jsx:179` condicionado a `tecnico` truthy.
2. Cambiar los cuatro `update()` del webhook por `set(..., { merge: true })`.
3. Escribir `suscripcionId` en **todos** los caminos que activan Pro; y fallback que busque la preaprobación por `external_reference`.
4. `webhooksFallidos` + responder 500 en error controlado.
5. **Prueba en sandbox de un ciclo recurrente completo** y ajuste del endpoint `/authorized_payments/{id}`.
6. Guardar el método de pago real y mapearlo al catálogo del SAT en `emitirFactura`.
7. Cloud Function admin que cancele el preapproval al quitar Pro / suspender / eliminar; `proAsignadoHasta` para el pago manual.
8. Filtrar por `suspendido != true` en la búsqueda y en el matching.

### Fase 3 — El producto: que el flujo funcione de punta a punta (1-2 semanas)

1. **Rutas y `popstate`:** extender `RUTAS_URL` a todas las pantallas con parámetro, leer `location.search` para `?vista=`, suscribirse a `popstate`, guardar `params` en el estado del `pushState`.
2. **Registro atómico:** trigger de Auth que cree el documento mínimo; `Login.jsx:39` → `routeAfterLogin`; recuperación desde `email-already-in-use`.
3. **Pantalla de edición de perfil** reutilizando `CompletarPerfil.jsx` + campo "Nombre completo" + "Restaurar mi texto original"; y que el agente escriba en `bioSugeridaIA`, no en `bio`.
4. **Reputación:** trigger de review → `rating`/`totalReviews`; `increment` de `totalTrabajos`; contador de `validaciones`; y que `Buscar.jsx` ordene por `rankScore`.
5. **Chat:** notificación al técnico al crear la solicitud; bandeja del cliente; panel del técnico con las aceptadas y `onSnapshot`; corregir el texto de rechazo.
6. **Feed:** filtrar por `aprobadoIA == true`; excluir `origen: 'chat'`; etiqueta según `estado`; quitar `clienteNombre` de lo público.
7. **Cotizaciones:** quitar `estado` de `guardar()`; bloquear aceptar en vencidas/borrador; notificación al aceptar con `aceptadaEn`; `catch` visible en las tres escrituras; gate de plan (o freemium con tope).
8. **Búsqueda:** selectores de categoría en `Registro.jsx` + backfill de perfiles existentes; arreglar `buscarPorTexto` para que devuelva `categoriaId`; filtro geográfico solo contra ciudad.
9. **Care:** confirmación humana antes de publicar solicitud; try/catch por equipo; `timeoutSeconds: 540`; paginación con `ultimoAnalisisIA`; `solicitudAutoCreada` → fecha; cooldown de notificaciones; editar/eliminar equipo.
10. **Fiabilidad:** Sentry + `catch` con estado de error distinguible del estado vacío en Landing, Buscar, Feed, Chat, Care y Cotizaciones.

### Fase 4 — Escala y calidad (después de lanzar)

Migración de fotos a Cloud Storage · `lazy()` de todas las páginas y `manualChunks` · paginación en el ERP y agregados precalculados · TTL en `aiLogs` · `onSnapshot` y `orderBy` en la campana · contraste y accesibilidad · rejillas responsivas reales · SEO/prerender de perfiles · decidir el destino de agenteMatching y agenteRanking · exponer especialidades y certificaciones de la taxonomía.

---

### Lo que solo puedes hacer tú (acciones del dueño)

| Acción | Por qué bloquea |
|---|---|
| **Generar la clave reCAPTCHA v3 y activar App Check** en Firebase Console, y activar la protección anti-abuso de Auth | Sin esto el gasto de Gemini no tiene techo. Es el arreglo más barato de toda la auditoría |
| **Subir los CSD del SAT y pasar Facturapi a `sk_live_`** (`SETUP_PAGOS.md:207` lo tiene como pendiente) | Hoy los Términos prometen factura y el timbrado está en modo prueba |
| **Probar en sandbox un ciclo de suscripción recurrente completo** | Es la única forma de confirmar si los cobros mensuales se están registrando |
| **Decidir el modelo freemium**: qué es Pro de verdad y qué se restringe | Sin esto no hay razón para pagar $100/mes |
| **Decidir qué significa "Verificado"** y publicar el criterio, o cambiar el lenguaje | Es la promesa central del producto y hoy no acredita nada |
| **Decidir el destino de PlanCare** (ocultar o completar con cobro y operación) | Se anuncian precio, comisión y garantía de 48 h de un servicio que no puedes prestar |
| **Publicar domicilio físico completo y teléfono/WhatsApp** en Términos y Aviso | Obligatorio bajo LFPDPPP art. 16-I y LFPC art. 76 BIS-III **antes** de la transacción |
| **Definir con el contador la factura global mensual** | Art. 29 del CFF; hoy solo se factura a quien lo pide |
| **Dar de alta Apple Developer** (Services ID, Team ID, Key ID, .p8) o quitar el botón | Hoy el botón negro está a la vista de todos y devuelve instrucciones de consola |
| **Contratar Sentry** (plan gratuito basta) | Vas a cobrar a ciegas: hoy un fallo total del backend se ve como "aún no hay técnicos" |

---

**Resumen ejecutivo en una línea:** tienes un producto con buena arquitectura, buen criterio en las partes difíciles y textos legales bien redactados, pero con las puertas de datos abiertas, con el circuito del dinero incompleto y con una lista de beneficios que el código no entrega. Fase 0 y Fase 1 son cuestión de días y quitan el riesgo legal y el fraude. Fase 2 y 3 son entre dos y cuatro semanas y son las que hacen que cobrar $100 MXN/mes sea defendible. Antes de eso, no cobres.