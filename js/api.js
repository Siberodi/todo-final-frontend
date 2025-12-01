const API_URL = "https://dummyjson.com/todos";


async function safeJson(res) {
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const text = await res.text();
  if (!text) return null;      
  try {
    return JSON.parse(text);
  } catch (e) {

    throw new Error("Invalid JSON");
  }
}

function normalizeItem(x) {
    return {
      id: Number(x?.id),
      text: String(x?.todo ?? ""),      // <-- CAMBIO: Se usa "x.todo" en lugar de "x.text"
      done: Boolean(x?.completed),  // <-- CAMBIO: Se usa "x.completed" en lugar de "x.done"
      createdAt: Number.isFinite(Number(x?.createdAt)) ? Number(x.createdAt) : Date.now(),
      updatedAt: Number.isFinite(Number(x?.updatedAt)) ? Number(x.updatedAt) : Date.now(),
      _source: "api",
    };
  }

function isValidArray(data) {
  if (!Array.isArray(data)) return false;
  return data.every(
    (o) =>
      o &&
      typeof o === "object" &&
      "id" in o &&
      "text" in o &&
      "done" in o &&
      "createdAt" in o &&
      "updatedAt" in o
  );
}


export async function fetchExternalTodos() {
  
    try {
      const res = await fetch(API_URL);
      // Tu función safeJson se encarga de la respuesta inicial
      const data = await safeJson(res);
  
      // Extraemos el arreglo de tareas de la respuesta
      const taskArray = data?.todos;
  
      // Verificamos que sea un arreglo, pero ya no validamos cada campo aquí
      if (!Array.isArray(taskArray)) {
        console.warn("La respuesta de la API no es un arreglo.");
        return [];
      }
      
      // Tu función normalizeItem se encarga de corregir los nombres
      // de los campos ("todo" -> "text", "completed" -> "done")
      return taskArray.map(normalizeItem);
  
    } catch (e) {
      console.warn("No se pudieron traer los TODOS externos:", e?.message || e);
      if (window.Sentry) {
      window.Sentry.captureException(e);
    }
      return [];
    }
  }
