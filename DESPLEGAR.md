# Desplegar sin terminal

Todo el despliegue se puede hacer desde el navegador, apretando un botón en
GitHub. La configuración es de una sola vez (unos 10 minutos); después,
publicar son dos clics.

---

## Configuración inicial (una vez)

### 1. Crear una credencial para GitHub

Google necesita saber que ese robot tiene permiso para publicar en tu
proyecto.

1. Entra a la [consola de cuentas de servicio](https://console.cloud.google.com/iam-admin/serviceaccounts?project=habilis-eb89c)
   con la cuenta dueña del proyecto.
2. **Crear cuenta de servicio**. Nombre: `github-deploy`. Continuar.
3. Asígnale estos roles (botón *Agregar otro rol* por cada uno):
   - **Firebase Admin** (`roles/firebase.admin`)
   - **Cloud Functions Admin** (`roles/cloudfunctions.admin`)
   - **Usuario de cuenta de servicio** (`roles/iam.serviceAccountUser`)
   - **Descriptor de acceso a secretos de Secret Manager**
     (`roles/secretmanager.secretAccessor`)
   - **Administrador de objetos de Storage** (`roles/storage.objectAdmin`)
   - **Escritor de Artifact Registry** (`roles/artifactregistry.writer`)
4. Terminar. Ahora entra a la cuenta recién creada → pestaña **Claves** →
   *Agregar clave* → *Crear clave nueva* → **JSON**. Se descarga un archivo.

> Ese archivo es una llave con permisos amplios sobre tu proyecto. No lo
> subas al repositorio, no lo pegues en un chat y bórralo de Descargas
> cuando termines el paso 2.

### 2. Guardar la credencial en GitHub

1. Ve a
   [Settings → Secrets → Actions](https://github.com/Wilberthfdz/habilis/settings/secrets/actions)
   del repositorio.
2. **New repository secret**.
3. Nombre exacto: `FIREBASE_SERVICE_ACCOUNT`
4. En *Secret*, pega **todo el contenido** del archivo JSON (ábrelo con el
   Bloc de notas, selecciona todo, copia).
5. Guardar. GitHub lo cifra: ni siquiera tú puedes volver a verlo, y nunca
   aparece en los registros de ejecución.

### 3. Crear el secreto del webhook de Mercado Pago

Este va en Google, no en GitHub, y sí se puede desde el navegador:

1. Da de alta el webhook en Mercado Pago (ver `SETUP_PAGOS.md`, sección 3)
   y copia la clave secreta que te devuelve.
2. Entra a
   [Secret Manager](https://console.cloud.google.com/security/secret-manager?project=habilis-eb89c).
3. **Crear secreto**. Nombre exacto: `MP_WEBHOOK_SECRET`. En *Valor del
   secreto*, pega la clave. Crear.

---

## Publicar (cada vez)

1. Entra a la
   [pestaña Actions](https://github.com/Wilberthfdz/habilis/actions/workflows/deploy.yml).
2. **Run workflow** → elige la rama → deja `functions,firestore,hosting` →
   **Run workflow**.
3. Espera unos minutos y abre la ejecución para ver el resultado.

El último paso del flujo corre `npm run verificar`, que descarga el sitio
publicado y comprueba que trae los cambios. Si eso sale en verde, está
realmente en vivo.

---

## Si algo falla

| Mensaje | Qué significa |
|---|---|
| `Permission denied` / `403` | A la cuenta de servicio le falta alguno de los roles del paso 1.3. |
| `Secret MP_WEBHOOK_SECRET not found` | Falta el paso 3. |
| `HTTP Error: 400, Billing account` | El proyecto no está en plan Blaze, o venció la prueba gratuita. |
| `Failed to parse private key` | El JSON se pegó incompleto en el paso 2.4. Vuelve a copiarlo entero. |

Copia el error tal cual y pídeme ayuda: con el mensaje exacto se identifica
rápido.
