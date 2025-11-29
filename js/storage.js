// storage.js
const TODOS_KEY = "todos";

export function getTodos() {
  try { return JSON.parse(localStorage.getItem(TODOS_KEY)) ?? []; }
  catch { return []; }
}

export function setTodos(list) {
  localStorage.setItem(TODOS_KEY, JSON.stringify(list));
}
