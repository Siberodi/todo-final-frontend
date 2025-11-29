export function normalizeText(s = "") {
    return String(s).trim().replace(/\s+/g, " ").toLowerCase();
  }
  
  export function isOnlyNumbers(s = "") {
    return /^[\s\d]+$/.test(String(s));
  }
  
  /**
   * @param {string} text - Texto a validar
   * @param {Array<{text:string}>}
   * @returns {{ok:true}|{ok:false,msg:string}}
   */
  export function validateTaskText(text, existing = []) {
    const raw = text ?? "";
    const value = raw.trim();
  
    if (!value) return { ok: false, msg: "El texto no puede estar vacío." };
    if (value.length < 10) return { ok: false, msg: "Mínimo 10 caracteres." };
    if (isOnlyNumbers(value)) return { ok: false, msg: "No se permiten solo números." };
  
    const canon = normalizeText(value);
    const dup = existing.some(t => normalizeText(t.text) === canon);
    if (dup) return { ok: false, msg: "El texto ya existe." };
  
    return { ok: true };
  }
  
  