/**
 * @file storage.js — Capa de Persistencia de EduAventura G4
 *
 * SPEC Referencias:
 *   Parámetro 10 — Aislamiento en localStorage bajo clave única 'eduaventura_g4_save'.
 *   Parámetro 11 — Manejo blindado de excepciones con try...catch en cada acceso.
 *   Parámetro 18 — Esquema de Datos Canónico (JSON Local).
 *   Parámetro 19 — Formato de Registro de Niveles Internos.
 *   Parámetro 20 — Inicialización por Defecto Segura (inyección del JSON inicial).
 *   Parámetro 25 — Almacenamiento de Banderas de Diagnóstico (pre-test / post-test).
 *   Parámetro 21 — Respaldo manual offline como data-URI JSON.
 *   Parámetro 22 — Restauración de progreso desde archivo .json.
 */

'use strict';

// ─── Parámetro 10: Clave única de aislamiento ─────────────────────────────────
/** @constant {string} */
const SAVE_KEY = 'eduaventura_g4_save';

// ─── Parámetro 18 + 19 + 25: Esquema canónico por defecto ────────────────────
/**
 * Retorna un objeto JavaScript con la estructura completa del guardado inicial.
 *
 * Estructura canónica (Parámetro 18):
 * {
 *   version       : "1.0",
 *   user          : { alias, coins, stars_total },
 *   modules       : { m1_multiplicacion, m2_division, m3_fracciones_intro, m4_fracciones_ops },
 *   diagnostics   : { pretest_score, posttest_score }   ← Parámetro 25
 * }
 *
 * Formato de nivel interno (Parámetro 19):
 * { cleared, stars, errors, hints, time_sec }
 *
 * @returns {SaveData} El objeto de guardado con todos los módulos en estado inicial.
 */
export function getDefaultSave() {
  return {
    /** @type {string} Versión del esquema de datos */
    version: '1.0',

    /**
     * Datos del usuario/estudiante.
     * @type {{ alias: string, coins: number, stars_total: number, avatar: string, title: string, unlocked_avatars: string[], unlocked_titles: string[], highscores: Record<string, number> }}
     */
    user: {
      alias: 'Estudiante',
      coins: 0,
      gems: 10,
      stars_total: 0,
      avatar: '🧒',
      title: 'Novato Matemático',
      unlocked_avatars: ['🧒', '👧'],
      unlocked_titles: ['Novato Matemático'],
      highscores: { free_mode: 0, m1: 0, m2: 0, m3: 0, m4: 0 },
      best_streaks: { m1_multiplicacion: 0, m2_division: 0, m3_fracciones_intro: 0, m4_fracciones_ops: 0 },
      total_spins: 0,
      claimed_tasks: [],
      achievements: [],
      roulette_last_spin: { coins: 0, avatars: 0, titles: 0 },
      sfx_enabled: true,
      music_enabled: true,
      student_id: null,
      cloud_synced: false,
    },
    last_updated: new Date().toISOString(),

    /**
     * Estado de cada módulo temático.
     * Parámetro 20: solo m1_multiplicacion arranca con unlocked: true.
     * Parámetro 60: desbloqueo lineal de niveles (levels se puebla dinámicamente).
     * Parámetro 61: desbloqueo condicional de módulos.
     *
     * @type {Record<string, ModuleData>}
     */
    modules: {
      /** Módulo 1 — Multiplicación Avanzada y Propiedades (Parámetro 28) */
      m1_multiplicacion: {
        unlocked: true,   // ← Único módulo activo al inicio (Parámetro 20)
        completed: false,
        levels: {},       // Se rellena con LevelRecord al superar cada nivel
      },

      /** Módulo 2 — División Formal y Algorítmica (Parámetro 29) */
      m2_division: {
        unlocked: false,
        completed: false,
        levels: {},
      },

      /** Módulo 3 — Fracciones: Noción, Lectura y Representación (Parámetro 30) */
      m3_fracciones_intro: {
        unlocked: false,
        completed: false,
        levels: {},
      },

      /** Módulo 4 — Operaciones y Relaciones con Fracciones (Parámetro 31) */
      m4_fracciones_ops: {
        unlocked: false,
        completed: false,
        levels: {},
      },
    },

    /**
     * Parámetro 25 — Banderas de Diagnóstico (Pre-Test / Post-Test).
     * Se guardan como porcentaje de aciertos (0–100) o null si no se han realizado.
     * Usados en el cálculo de Ganancia de Hake (Parámetro 72).
     *
     * @type {{ pretest_score: number|null, posttest_score: number|null }}
     */
    diagnostics: {
      pretest_score: null,
      posttest_score: null,
    },
  };
}

// ─── Tipos de documentación (JSDoc) ──────────────────────────────────────────

/**
 * @typedef {Object} LevelRecord
 * Parámetro 19 — Formato de Registro de Niveles Internos.
 * @property {boolean} cleared   - El nivel fue superado exitosamente.
 * @property {number}  stars     - Estrellas obtenidas (1, 2 o 3). Fórmula: Parámetro 56.
 * @property {number}  errors    - Cantidad de errores cometidos en ese intento.
 * @property {number}  hints     - Cantidad de pistas usadas (máx. 1–2 según nivel).
 * @property {number}  time_sec  - Tiempo de resolución en segundos (solo estadístico).
 */

/**
 * @typedef {Object} ModuleData
 * @property {boolean}                  unlocked  - Si el módulo está disponible.
 * @property {boolean}                  completed - Si el Nivel Maestro (15) fue superado.
 * @property {Record<string, LevelRecord>} levels - Mapa de niveles: clave "l1"…"l15".
 */

/**
 * @typedef {Object} SaveData
 * @property {string}                      version
 * @property {{ alias: string, coins: number, stars_total: number }} user
 * @property {Record<string, ModuleData>}  modules
 * @property {{ pretest_score: number|null, posttest_score: number|null }} diagnostics
 */

// ─── API Pública ──────────────────────────────────────────────────────────────

/**
 * Carga el guardado desde localStorage.
 *
 * Parámetro 11: envuelto en try...catch para modos incógnito o cuotas saturadas.
 * Parámetro 20: si no existe dato previo, inyecta el JSON inicial (getDefaultSave).
 *
 * @returns {SaveData} El estado de guardado actual o el estado inicial por defecto.
 */
export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      // Parámetro 20: primer arranque → inicializar con datos por defecto
      const defaultData = getDefaultSave();
      saveSave(defaultData);
      return defaultData;
    }
    const parsed = JSON.parse(raw);
    // Migración defensiva: si la versión del esquema cambia en el futuro,
    // se puede agregar lógica de migración aquí sin romper datos existentes.
    return _migrate(parsed);
  } catch (err) {
    console.warn('[Storage] loadSave: error al leer localStorage.', err);
    return getDefaultSave();
  }
}

/**
 * Persiste el objeto de guardado completo en localStorage.
 *
 * Parámetro 11: envuelto en try...catch para cuotas saturadas o modos restringidos.
 *
 * @param {SaveData} data - El objeto de guardado a serializar.
 * @returns {boolean} true si la escritura fue exitosa; false si hubo error.
 */
export function saveSave(data) {
  try {
    if (data) {
      data.last_updated = new Date().toISOString();
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.warn('[Storage] saveSave: error al escribir en localStorage.', err);
    return false;
  }
}

/**
 * Restablece el guardado a los valores de fábrica.
 *
 * Parámetro 75: Solo invocado tras la verificación matemática del docente.
 * Parámetro 11: try...catch.
 *
 * @returns {SaveData} El objeto de guardado inicial recién escrito.
 */
export function resetSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (err) {
    console.warn('[Storage] resetSave: error al eliminar clave.', err);
  }
  const fresh = getDefaultSave();
  saveSave(fresh);
  return fresh;
}

// ─── Utilidades de nivel ──────────────────────────────────────────────────────

/**
 * Registra el resultado de un nivel superado dentro del módulo correspondiente.
 *
 * @param {SaveData} data      - El estado de guardado actual (mutado in-place).
 * @param {string}  moduleKey  - Clave del módulo (ej. 'm1_multiplicacion').
 * @param {number}  levelNum   - Número de nivel (1 al 15).
 * @param {LevelRecord} record - Datos del intento.
 * @returns {SaveData}         - El mismo objeto mutado (para encadenamiento).
 */
export function recordLevelResult(data, moduleKey, levelNum, record) {
  if (!data.modules[moduleKey]) {
    console.warn('[Storage] recordLevelResult: módulo desconocido', moduleKey);
    return data;
  }
  const levelKey = `l${levelNum}`;
  const existing = data.modules[moduleKey].levels[levelKey];

  // Guardar solo si es primera vez o si se mejora la puntuación de estrellas
  if (!existing || record.stars > existing.stars) {
    data.modules[moduleKey].levels[levelKey] = {
      cleared: record.cleared,
      stars: record.stars,
      errors: record.errors,
      hints: record.hints,
      time_sec: record.time_sec,
    };
  }
  return data;
}

/**
 * Desbloquea el siguiente módulo si el actual ha sido completado
 * (Nivel Maestro 15 superado con `cleared: true`).
 *
 * Parámetro 61: Desbloqueo Condicional de Módulos.
 *
 * @param {SaveData} data      - Estado de guardado actual.
 * @param {string}   moduleKey - Módulo que acaba de completar su Nivel Maestro.
 * @returns {SaveData}
 */
export function tryUnlockNextModule(data, moduleKey) {
  const MODULE_ORDER = [
    'm1_multiplicacion',
    'm2_division',
    'm3_fracciones_intro',
    'm4_fracciones_ops',
  ];
  const idx = MODULE_ORDER.indexOf(moduleKey);
  if (idx === -1 || idx === MODULE_ORDER.length - 1) return data;

  // Requisito estricto: deben estar completados los 20 niveles del módulo actual
  const curr = data.modules[moduleKey];
  const lvls = Object.values(curr?.levels || {});
  const clearedCount = lvls.filter((l) => l.cleared && (l.stars || 0) >= 1).length;
  if (clearedCount < 20) return data;

  const nextKey = MODULE_ORDER[idx + 1];
  if (data.modules[nextKey] && !data.modules[nextKey].unlocked) {
    data.modules[nextKey].unlocked = true;
  }
  return data;
}

// ─── Parámetro 21: Exportación offline del progreso ──────────────────────────
/**
 * Genera un enlace `<a>` de descarga directa del archivo de progreso en JSON.
 * Invocado desde el Panel del Docente (Parámetro 172).
 *
 * @param {SaveData} data - El estado de guardado actual.
 * @returns {HTMLAnchorElement} Elemento <a> listo para disparar .click().
 */
export function buildExportLink(data) {
  const json = JSON.stringify(data, null, 2);
  const uri = `data:text/json;charset=utf-8,${encodeURIComponent(json)}`;
  const anchor = document.createElement('a');
  anchor.href = uri;
  anchor.download = 'progreso_eduaventura.json';
  return anchor;
}

/**
 * Parámetro 22 — Restaura el progreso desde un objeto JSON externo.
 * Llamado tras leer un archivo .json con FileReader en el Panel Docente.
 *
 * @param {SaveData} importedData - Datos parseados del archivo de respaldo.
 * @returns {{ ok: boolean, data?: SaveData, error?: string }}
 */
export function importSave(importedData) {
  try {
    if (!importedData || typeof importedData !== 'object') {
      return { ok: false, error: 'El archivo no contiene datos válidos.' };
    }
    if (!importedData.version || !importedData.modules || !importedData.user) {
      return { ok: false, error: 'El archivo no tiene el formato esperado de EduAventura.' };
    }
    const migrated = _migrate(importedData);
    saveSave(migrated);
    return { ok: true, data: migrated };
  } catch (err) {
    console.warn('[Storage] importSave: error al importar.', err);
    return { ok: false, error: 'No se pudo restaurar el archivo.' };
  }
}

// ─── Migración defensiva de versiones ────────────────────────────────────────
/**
 * Migra un objeto de guardado anterior al esquema actual si es necesario.
 * Garantiza retrocompatibilidad sin perder datos.
 *
 * @param {object} data - Datos crudos de localStorage.
 * @returns {SaveData}
 */
function _migrate(data) {
  const fresh = getDefaultSave();

  // Asegurar que existan todas las claves esperadas (merge defensivo)
  data.version = data.version ?? fresh.version;
  data.user = { ...fresh.user, ...(data.user ?? {}) };
  data.user.unlocked_avatars = Array.isArray(data.user.unlocked_avatars) ? data.user.unlocked_avatars : ['🧒', '👧'];
  if (data.user.avatar && !data.user.unlocked_avatars.includes(data.user.avatar)) {
    data.user.unlocked_avatars.push(data.user.avatar);
  }
  data.user.unlocked_titles = Array.isArray(data.user.unlocked_titles) ? data.user.unlocked_titles : ['Novato Matemático'];
  data.user.title = data.user.title || 'Novato Matemático';
  data.user.highscores = data.user.highscores || { free_mode: 0, m1: 0, m2: 0, m3: 0, m4: 0 };
  data.user.best_streaks = data.user.best_streaks || { m1_multiplicacion: 0, m2_division: 0, m3_fracciones_intro: 0, m4_fracciones_ops: 0 };
  data.user.total_spins = typeof data.user.total_spins === 'number' ? data.user.total_spins : 0;
  data.user.claimed_tasks = Array.isArray(data.user.claimed_tasks) ? data.user.claimed_tasks : [];
  data.user.achievements = Array.isArray(data.user.achievements) ? data.user.achievements : [];
  data.user.gems = typeof data.user.gems === 'number' ? data.user.gems : 10;
  data.user.roulette_last_spin = data.user.roulette_last_spin || { coins: 0, avatars: 0, titles: 0 };
  data.user.sfx_enabled = typeof data.user.sfx_enabled === 'boolean' ? data.user.sfx_enabled : true;
  data.user.music_enabled = typeof data.user.music_enabled === 'boolean' ? data.user.music_enabled : true;
  data.user.student_id = data.user.student_id || null;
  data.user.cloud_synced = typeof data.user.cloud_synced === 'boolean' ? data.user.cloud_synced : false;
  data.last_updated = data.last_updated || new Date().toISOString();
  data.diagnostics = { ...fresh.diagnostics, ...(data.diagnostics ?? {}) };

  for (const key of Object.keys(fresh.modules)) {
    if (!data.modules) data.modules = {};
    if (!data.modules[key]) {
      data.modules[key] = { ...fresh.modules[key] };
    } else {
      data.modules[key] = {
        unlocked: data.modules[key].unlocked ?? fresh.modules[key].unlocked,
        completed: data.modules[key].completed ?? false,
        levels: data.modules[key].levels ?? {},
      };
    }
  }

  // Regla estricta de progresión: cada módulo requiere haber superado los 20 niveles del anterior
  const MODULE_ORDER = ['m1_multiplicacion', 'm2_division', 'm3_fracciones_intro', 'm4_fracciones_ops'];
  for (let i = 0; i < MODULE_ORDER.length; i++) {
    const key = MODULE_ORDER[i];
    if (i === 0) {
      if (data.modules[key]) data.modules[key].unlocked = true;
    } else {
      const prevKey = MODULE_ORDER[i - 1];
      const prevLvls = Object.values(data.modules[prevKey]?.levels || {});
      const prevCleared = prevLvls.filter((l) => l.cleared && (l.stars || 0) >= 1).length;
      if (data.modules[key]) {
        data.modules[key].unlocked = (prevCleared >= 20);
      }
    }
  }

  // Sincronización canónica automática de estrellas totales (suma real de mejores estrellas en todos los módulos)
  let computedStars = 0;
  for (const modKey of Object.keys(data.modules || {})) {
    const lvls = Object.values(data.modules[modKey]?.levels || {});
    for (const lvl of lvls) {
      if (lvl?.cleared && typeof lvl?.stars === 'number') {
        computedStars += lvl.stars;
      }
    }
  }
  data.user.stars_total = computedStars;

  return data;
}
