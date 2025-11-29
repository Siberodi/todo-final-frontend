
import { isAuthenticated, logout } from "../js/auth.js";
import { getTodos, setTodos } from "../js/storage.js";
import { validateTaskText } from "../js/validator.js";
import { fetchExternalTodos } from "../js/api.js";

function sameDir(file) {
  const url = new URL(window.location.href);
  url.pathname = url.pathname.replace(/[^/]+$/, file);
  return url.toString();
}

function calcularEstado(dueAt) {
  if (!dueAt) return { texto: "📅 Programada", clase: "programada" };
  const ahora = Date.now();
  const diffH = (Number(dueAt) - ahora) / (1000 * 60 * 60);
  if (isNaN(diffH)) return { texto: "📅 Programada", clase: "programada" };
  if (diffH < 0) return { texto: "❌ Vencida", clase: "vencida" };
  if (diffH <= 24) return { texto: "⏳ Por vencer", clase: "por-vencer" };
  return { texto: "📅 Programada", clase: "programada" };
}

function fmt(ts) {
  if (!ts && ts !== 0) return "—";
  const d = new Date(Number(ts));
  return isNaN(d) ? "—" : d.toLocaleString();
}

if (!isAuthenticated()) {
  window.location.href = sameDir("index.html");
}

const listEl   = document.getElementById("todo-list");
const formEl   = document.getElementById("new-todo-form");
const inputEl  = document.getElementById("new-todo-text");
const dueEl    = document.getElementById("new-todo-due") || document.getElementById("fechaHora");
const errorEl  = document.getElementById("todo-error");
const logoutBtn = document.getElementById("logout-btn");


let localTodos = getTodos(); 
let apiTodos   = [];
let combined   = [];

/* ===================== Eventos globales ===================== */
logoutBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  logout();
  window.location.href = sameDir("index.html");
});

/* ===================== Inicialización ===================== */
document.addEventListener("DOMContentLoaded", async () => {
    // Trae tareas externas requeridas y después renderiza todo junto
    apiTodos = await fetchExternalTodos();
    render();
  });

/* ===================== Crear ===================== */
formEl?.addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = inputEl?.value ?? "";
  const check = validateTaskText(raw, localTodos);
  if (!check.ok) { errorEl.textContent = check.msg; errorEl.hidden = false; return; }

  // Si existe input de fecha en el HTML, exigimos fecha
  let dueAt = null;
  if (dueEl) {
    if (!dueEl.value) {
      errorEl.textContent = "Asigna una fecha y hora.";
      errorEl.hidden = false;
      return;
    }
    dueAt = new Date(dueEl.value).getTime();
  }

  errorEl.hidden = true;

  const now = Date.now();
  const todo = {
    id: now,
    text: raw.trim(),
    done: false,
    createdAt: now,
    updatedAt: now,
    dueAt,
    _source: "local"
  };

  localTodos.unshift(todo);       
  setTodos(localTodos);
  if (inputEl) inputEl.value = "";
  if (dueEl) dueEl.value = "";
  render();
});

/* ===================== Delegación: clicks (editar/eliminar) ===================== */
listEl?.addEventListener("click", (e) => {
  const itemEl = e.target.closest(".item");
  if (!itemEl) return;

  const id = Number(itemEl.dataset.id);
  const isLocal = itemEl.dataset.source === "local";


  if (e.target.matches(".btn-del")) {
    if (!isLocal) return;
    localTodos = localTodos.filter(t => t.id !== id);
    setTodos(localTodos);
    render();
    return;
  }


  if (e.target.matches(".btn-edit")) {
    if (!isLocal) return;
    itemEl.classList.add("editing");
    const input = itemEl.querySelector(".edit-input");
    const textEl = itemEl.querySelector(".todo-text");
    const btnSave = itemEl.querySelector(".btn-save");
    const btnCancel = itemEl.querySelector(".btn-cancel");
    const btnEdit = itemEl.querySelector(".btn-edit");

    input.value = textEl.textContent;
    textEl.hidden = true;
    input.hidden = false;
    btnSave.hidden = false;
    btnCancel.hidden = false;
    btnEdit.hidden = true;
    input.focus();
    return;
  }


  if (e.target.matches(".btn-save")) {
    if (!isLocal) return;
    const input = itemEl.querySelector(".edit-input");
    const nextText = input.value;
    const others = localTodos.filter(t => t.id !== id);
    const check = validateTaskText(nextText, others);
    const err = itemEl.querySelector(".item-error");
    if (!check.ok) { err.textContent = check.msg; err.hidden = false; return; }
    err.hidden = true;

    const now = Date.now();
    localTodos = localTodos.map(t => t.id === id ? { ...t, text: nextText.trim(), updatedAt: now } : t);
    setTodos(localTodos);
    render();
    return;
  }


  if (e.target.matches(".btn-cancel")) {
    itemEl.classList.remove("editing");
    const textEl = itemEl.querySelector(".todo-text");
    const input = itemEl.querySelector(".edit-input");
    const btnSave = itemEl.querySelector(".btn-save");
    const btnCancel = itemEl.querySelector(".btn-cancel");
    const btnEdit = itemEl.querySelector(".btn-edit");

    textEl.hidden = false;
    input.hidden = true;
    btnSave.hidden = true;
    btnCancel.hidden = true;
    btnEdit.hidden = false;
    itemEl.querySelector(".item-error").hidden = true;
    return;
  }
});

/* ===================== Delegación: cambios (checkbox done) ===================== */
listEl?.addEventListener("change", (e) => {
  const itemEl = e.target.closest(".item");
  if (!itemEl || !e.target.matches(".toggle-done")) return;
  const id = Number(itemEl.dataset.id);
  const isLocal = itemEl.dataset.source === "local";
  if (!isLocal) return;

  const now = Date.now();
  localTodos = localTodos.map(t => t.id === id ? { ...t, done: e.target.checked, updatedAt: now } : t);
  setTodos(localTodos);
  render();
});

/* ===================== Render ===================== */
function render() {
  combined = [...localTodos, ...apiTodos];
  // Orden cronológico: nuevos arriba
  combined.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  listEl.innerHTML = combined.map(t => {
    const estado = calcularEstado(t.dueAt);
    return `
      <article class="item" data-id="${t.id}" data-source="${t._source}">
        <!-- fila top: checkbox + acciones -->
        <div class="item-top">
          <label class="check">
            <input type="checkbox" class="toggle-done" ${t.done ? "checked" : ""} ${t._source === "local" ? "" : "disabled"}>
            <span>Hecha</span>
          </label>
          <div class="todo-actions">
            ${t._source === "local" ? `
              <button class="btn-edit">Editar</button>
              <button class="btn-save" hidden>Guardar</button>
              <button class="btn-cancel" hidden>Cancelar</button>
              <button class="btn-del">Delete</button>
            ` : `<span class="chip">API</span>`}
          </div>
        </div>
  
        <!-- fila título: id + texto + estado -->
        <div class="title-row">
          <span class="badge badge-id">#${t.id}</span>
          <div class="title">
            <span class="todo-text">${t.text}</span>
            <input class="edit-input" hidden />
          </div>
          <span class="badge status ${estado.clase}">${estado.texto}</span>
        </div>
  
        <!-- meta en tarjetas -->
        <div class="meta">
          <div class="kv"><span class="k">Done:</span>   <span class="v">${t.done ? "COMPLETADA" : "Pendiente"}</span></div>
          <div class="kv"><span class="k">Create:</span> <span class="v">${fmt(t.createdAt)}</span></div>
          <div class="kv"><span class="k">Update:</span> <span class="v">${fmt(t.updatedAt)}</span></div>
          <div class="kv"><span class="k">Due:</span>    <span class="v">${fmt(t.dueAt)}</span></div>
        </div>
  
        <p class="item-error error" role="alert" hidden></p>
      </article>
    `;
  }).join("");
  
}


