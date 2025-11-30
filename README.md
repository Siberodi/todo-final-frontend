# Proyecto Academico Realizado por: Alejandro Fontalvo, Juan Morales y Sibeli Rodriguez

# TODO Final Frontend 

Aplicación web sencilla de **lista de tareas (TODO)** desarrollada en HTML, CSS y JavaScript puro.

Este proyecto se usa para practicar:

- Integración de **Sentry** para monitoreo de errores.
- Integración de **Google Analytics 4 (GA4)** para métricas de uso.
- Despliegue en **Firebase Hosting**.
- **GitHub Actions** para CI/CD (deploy automático al hacer push a `main`).

---

## Demo en producción

- **Sitio en Firebase Hosting:**  
  https://todo-final-frontend-a29da.web.app

---

## Funcionalidades principales

- Crear, listar y marcar tareas como completadas.
- Validación básica de formularios.
- Manejo de errores en el frontend.
- Reporte de errores a **Sentry**.
- Registro de visitas y eventos en **Google Analytics 4**.
- Deploy automático desde GitHub a Firebase Hosting.

---

## 🛠 Stack tecnológico

- **Frontend:** HTML, CSS, JavaScript
- **Monitoreo de errores:** [Sentry](https://sentry.io/)
- **Métricas de uso:** Google Analytics 4
- **Hosting:** Firebase Hosting
- **CI/CD:** GitHub Actions

---



## Estructura del proyecto

```bash
.
├── html/
│   ├── index.html          # Pantalla de inicio / login
│   ├── todos.html          # Pantalla principal de la app de tareas
│   └── config.js           # Configuración generada por CI (Sentry + GA)
├── js/
│   ├── auth.js             # Lógica de autenticación / validaciones iniciales
│   ├── api.js              # Lógica de acceso a datos / API simulada
│   ├── todos.js            # Lógica de la lista de tareas
│   └── validator.js        # Validaciones de formularios
├── assets/                 # Imágenes, fondos, etc.
├── .github/
│   └── workflows/
│       └── firebase-hosting.yml   # Workflow de GitHub Actions para deploy
├── firebase.json           # Configuración de Firebase Hosting
├── .firebaserc             # Alias de proyecto Firebase
└── README.md



