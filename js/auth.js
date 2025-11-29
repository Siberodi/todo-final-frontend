// auth.js
const AUTH_KEY = "auth";
const users = [{ username: "admin", password: "admin" }];

export function isAuthenticated() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY))?.loggedIn === true; }
  catch { return false; }
}

export function login(username, password) {
  const ok = users.some(u => u.username === username && u.password === password);
  if (!ok) return false;
  localStorage.setItem(AUTH_KEY, JSON.stringify({ loggedIn: true, username }));
  return true;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

// --- Lógica específica cuando estoy en login:
if (location.pathname.endsWith("index.html") || location.pathname.endsWith("/")) {
  // Si ya está logueado, ir a To-Do
  if (isAuthenticated()) location.href = "todos.html";

  const form = document.getElementById("login-form");
  const error = document.getElementById("login-error");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    if (login(username, password)) {
      location.href = "todos.html";
    } else {
      error.textContent = "Credenciales inválidas";
      error.hidden = false;
    }
  });
}
