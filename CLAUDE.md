# Habilis

Plataforma de reputación profesional para trabajadores técnicos en México (electricistas,
plomeros, técnicos en A/C, instaladores de cámaras). Modelo bolsa de trabajo especializada:
el técnico crea perfil y documenta trabajos con fotos, el cliente lo encuentra y contacta
directo. **No cobra comisión ni intermedia pagos.** Cliente siempre gratis.

- En vivo: **myhabilis.com** · Repo público: `Wilberthfdz/habilis` · Firebase: `habilis-eb89c`
- Fundador: Wilberth Fernández Quen (Cancún, QRoo). Socio: Rafa.
- Inscrito al XPRIZE de Google (fecha límite ≈ 17 ago 2026).

## ⚠️ Leer antes de trabajar

La fuente de verdad del estado y los pendientes **no está en el repo**, está en el vault de Obsidian:

```
C:\Users\Timor\Documents\Obsidian Vault\Habilis\
├── Pendientes.md      ← LEER PRIMERO al retomar. Estado real, decisiones abiertas, bitácora.
├── Arquitectura.md    ← diagrama, los 6 agentes, colecciones, reglas de diseño
├── Habilis.md         ← visión de producto, planes, precios, capital
└── Auditoria-Frontend.md
```

Al terminar una sesión con cambios de fondo, actualizar esos archivos.

## Comandos

```bash
npm run dev         # Vite dev server
npm run build       # build a dist/
npm test            # pruebas de functions (20/20 en verde)
npm run verificar   # scripts/verificarDespliegue.mjs — chequeo pre-deploy
npm run deploy      # test + build + deploy de functions,firestore,hosting

firebase deploy --only hosting          # deploy parcial más común
firebase deploy --only firestore:rules
```

**Antes de CUALQUIER deploy: `firebase login:list`.** No dar por hecho la cuenta activa —
la correcta es `habilisempresa@gmail.com`. Si hay que relogear, `firebase login` normal
**crashea en este Windows** (`Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`);
el workaround es `firebase login --no-localhost` (crashea igual pero deja impresa la URL),
visitar la URL, y completar con `firebase login <código>`.

También existe CI/CD por GitHub Actions (`.github/workflows/deploy.yml`, ver `DESPLEGAR.md`)
para publicar sin terminal — **aún no funciona**: falta `FIREBASE_SERVICE_ACCOUNT` en GitHub
Secrets y `MP_WEBHOOK_SECRET` en Secret Manager. Ambos son pasos manuales de consola que
solo Wilberth puede hacer.

## Stack

- **Frontend**: React 18 + Vite 6, Firebase Hosting. `src/pages`, `src/components`, `src/lib`,
  `src/pages/admin`.
- **Auth**: Firebase Auth (email, Google, Apple)
- **DB**: Firestore. Reglas en `firestore.rules`.
- **Backend**: Cloud Functions v2 en `functions/index.js` (~22 exports). **Sigue en Node 20**,
  deprecado — se decomisiona el **2026-10-30**, migrar a 22 sigue pendiente.
- **IA**: Gemini vía REST directa, sin SDK. Modelo **`gemini-3.6-flash`** (el `2.0-flash`
  fue retirado). Ese modelo gasta cientos de tokens en "thinking" antes de responder →
  `maxTokens` de 900-2000 por llamada o la respuesta se trunca con `finishReason:"MAX_TOKENS"`.
  `thinkingConfig:{thinkingBudget:0}` **no** es válido en la API real (devuelve 400).
- **Pagos**: Mercado Pago, credenciales de **producción**.
- **Facturación**: Facturapi (CFDI México). **Correo**: Resend sobre `noreply@myhabilis.com`
  (los correos default de Firebase caían en spam).

## Los 6 agentes autónomos

Reaccionan a eventos de Firestore o a cron; nadie los llama a mano. Cada decisión se registra
en la colección `aiLogs` — es la evidencia de "IA viva en producción" que pide el XPRIZE.

| Agente | Dispara | Hace |
|---|---|---|
| `agenteMatching` | onCreate `solicitudes` | asigna los 3 mejores técnicos, notifica |
| `agenteModeradorTrabajos` | onCreate `trabajos` | spam/categoría/urgencia/calidad |
| `agenteVerificador` | onCreate `tecnicos` | score inicial, reescribe la bio |
| `agenteCare` | cron 08:00 | salud de equipos; en rojo crea solicitud automática |
| `agenteRanking` | cron 08:30 | `rankScore` de búsqueda |
| `agenteRenovaciones` | cron diario | recordatorio de vencimiento a los de OXXO/SPEI |

⚠️ Brecha conocida: `agenteMatching` escucha `solicitudes`, pero el botón real
"Solicitar servicio" escribe en **`solicitudes_chat`**, colección sin trigger.

## Reglas de diseño (respetarlas)

- Los agentes **nunca** tocan campos de estado humano (`estado`, `tipo`). Todo lo que escribe
  la IA va a campos con sufijo `IA` (`aprobadoIA`, `categoriaIA`, `rankScore`…).
- `plan: "pro"` **solo** lo escribe `webhookMP` server-side, verificando contra la API real de
  Mercado Pago. El cliente lo tiene bloqueado por reglas de Firestore. Nunca confiar a ciegas
  en el payload del webhook.
- Cualquier escritura que dependa de un **conteo o límite de negocio** (≤10 empleados,
  ≤5 trabajos gratis, doble reserva de horario, uso único de promo) va por **transacción de
  Firestore con lecturas normales** (no `count()` agregado) o por **id de documento
  determinístico** (`${tecnicoId}_${fecha}_${hora}` en `citas`, `mp_${pago.id}` en `pagos`,
  el slug mismo como id en `slugs`) — así un `tx.get()` basta como candado atómico.
- Webhooks idempotentes: chequeo transaccional de "primera vez" antes de extender un plan.
- Rate limiting por usuario/acción en la colección `rateLimits` antes de llamar a Gemini,
  Mercado Pago o Facturapi.
- Fotos de perfil van como base64 en Firestore, **no** en Cloud Storage (decisión explícita).
- **El repo es público** → ningún secreto en archivos. Van en Firebase Secret Manager
  (`GEMINI_KEY`, `MP_ACCESS_TOKEN`, `FACTURAPI_KEY`, `MP_WEBHOOK_SECRET`) o Codespaces secrets.

## Planes

- **Gratis**: perfil + 5 trabajos documentados.
- **Pro $149 MXN/mes**: prioridad, trabajos ilimitados, IA, cotizaciones, Habilis Care,
  análisis de mercado, verificación de identidad, link de perfil (`/t/slug`), agenda de citas.
- **Empresa $499 MXN/mes**: todo Pro + hasta 10 empleados con perfil propio.
- Tarjeta = Preapproval recurrente. OXXO/SPEI = Checkout Preference de pago único con
  renovación manual (Preapproval no soporta OXXO/SPEI).

Admins (`isAdmin()` en `firestore.rules` / Nav / AdminLayout): `wilberthfdz@gmail.com`,
`frnlcm13@gmail.com`.

## Archivos sensibles a conflictos

`App.jsx`, `Nav.jsx`, `Login.jsx`, `Registro.jsx` combinan lógica de tipo de cuenta
(técnico/cliente/dual) con `quierePro` (redirección a checkout). Se resolvieron conflictos
reales ahí en el merge `571c377`; tocarlos con cuidado.

## Idioma

Wilberth trabaja en español. Responder en español; nombres de código y commits también
en español, como el resto del repo.
