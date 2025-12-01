# Proyecto Academico Realizado por: Alejandro Fontalvo, Juan Morales y Sibeli Rodriguez

# Checklist To Do – Proyecto Frontend

Aplicación web tipo **Checklist / To Do** desarrollada en HTML, CSS y JavaScript.  
Este proyecto hace parte del entregable final de la materia e incluye integración de herramientas de observabilidad, analítica y despliegue continuo.

---

## Descripción del proyecto

La aplicación permite:

- Iniciar sesión con un usuario y contraseña (simulados en frontend).
- Crear tareas con fecha y hora límite.
- Listar tareas pendientes.
- Marcar tareas como completadas.
- Visualizar los cambios en una interfaz sencilla tipo “card”.

El enfoque principal del entregable no es la complejidad de la lógica de negocio, sino la integración de:

- **Monitoreo de errores (observabilidad)** con Sentry.
- **Analíticas de uso** con Google Analytics.
- **Despliegue automático (CI/CD)** con GitHub Actions hacia Firebase Hosting.

---

## URL de producción

La aplicación está desplegada en Firebase Hosting y se puede acceder en:

**https://todo-final-frontend-a29da.web.app**

Usuario: admin
Contraseña: admin
Cada vez que se hace `git push` a la rama `main`, el proyecto se vuelve a construir y desplegar automáticamente en esta URL.

---

## Monitoreo de errores con Sentry

Se integró **Sentry** para capturar errores en el frontend:

- Sentry se inicializa usando un `DSN` almacenado en una variable global `window.APP_CONFIG.SENTRY_DSN`.
- La configuración sensible **no está en el código**: se inyecta en `config.js` desde **GitHub Secrets** durante el workflow de CI.
- Cualquier error no capturado en el navegador (por ejemplo, usar `throw new Error("Error de prueba")` desde la consola) se envía automáticamente a Sentry y se registra como un *issue*.
- Se agregó además un error de prueba automático en las vistas principales para validar que la integración funcione en producción.

Esto permite tener **observabilidad** sobre fallos que se presenten en la app una vez desplegada.

---

## Analíticas con Google Analytics (GA4)

Se integró **Google Analytics 4** para registrar el uso de la aplicación:

- El ID de medición (`GA_MEASUREMENT_ID`) también se carga desde `window.APP_CONFIG`, generado en `config.js` a partir de un **GitHub Secret**.
- El script de GA4 se inserta dinámicamente en el HTML y se inicializa cuando la app se carga en el navegador.
- Desde el panel de Google Analytics es posible ver:
  - Usuarios activos en tiempo real.
  - Páginas visitadas (pantalla de login y pantalla de tareas).
  - Eventos básicos de navegación.

De esta forma se puede analizar cómo los usuarios interactúan con la aplicación desplegada.

---

## CI/CD con GitHub Actions y Firebase Hosting

Para el despliegue continuo se usó:

- **Firebase Hosting** como servicio de hosting estático.
- **GitHub Actions** como plataforma de CI/CD.

El flujo es:

1. Cuando se hace `push` a la rama `main`, se ejecuta un workflow definido en:
   - `.github/workflows/firebase-hosting.yml`
2. El workflow:
   - Hace checkout del repositorio.
   - Genera el archivo `html/config.js` a partir de los **GitHub Secrets**:
     - `SENTRY_DSN`
     - `GA_MEASUREMENT_ID`
   - Usa `FIREBASE_TOKEN` (token generado con `firebase login:ci`) para autenticarse contra Firebase.
   - Ejecuta el comando de despliegue:
     - `firebase deploy --only hosting --project todo-final-frontend-a29da`

Si el workflow finaliza correctamente, la nueva versión queda disponible de forma inmediata en:

👉 `https://todo-final-frontend-a29da.web.app`

Esto asegura que el proyecto tenga un **proceso automatizado de build y deploy**, sin necesidad de ejecutar comandos manuales en cada cambio.

---



