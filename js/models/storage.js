// Guardar y cargar el progreso del jugador en el navegador
'use strict';

// Nombre con el que se guardan los datos en el navegador
const SAVE_KEY = 'eduaventura_g4_save';

// Datos por defecto para cuando un jugador empieza de cero
export function getDefaultSave() {
  return {
    version: '1.0',

    // Perfil y estadísticas del jugador
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

    // Estado y niveles de cada módulo
    modules: {
      // Módulo 1: Multiplicación (empieza abierto)
      m1_multiplicacion: {
        unlocked: true,
        completed: false,
        levels: {},
      },

      // Módulo 2: División
      m2_division: {
        unlocked: false,
        completed: false,
        levels: {},
      },

      // Módulo 3: Fracciones I
      m3_fracciones_intro: {
        unlocked: false,
        completed: false,
        levels: {},
      },

      // Módulo 4: Fracciones II
      m4_fracciones_ops: {
        unlocked: false,
        completed: false,
        levels: {},
      },
    },

    // Notas de la prueba inicial y final
    diagnostics: {
      pretest_score: null,
      posttest_score: null,
    },
  };
}

// Carga los datos guardados; si no hay nada o da error, pone los datos por defecto
export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      // Primera vez que entra: inicializar con datos limpios
      const defaultData = getDefaultSave();
      saveSave(defaultData);
      return defaultData;
    }
    const parsed = JSON.parse(raw);
    // Completar cualquier campo nuevo que falte
    return _migrate(parsed);
  } catch (err) {
    console.warn('[Storage] loadSave: error al leer localStorage.', err);
    return getDefaultSave();
  }
}

// Guarda todos los datos del jugador en el navegador
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

// Borra la partida y reinicia todo a cero
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

// Guarda las estrellas y resultado del nivel si sacó mejor puntuación
export function recordLevelResult(data, moduleKey, levelNum, record) {
  if (!data.modules[moduleKey]) {
    console.warn('[Storage] recordLevelResult: módulo desconocido', moduleKey);
    return data;
  }
  const levelKey = `l${levelNum}`;
  const existing = data.modules[moduleKey].levels[levelKey];

  // Solo sobreescribe si es la primera vez o si consiguió más estrellas
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

// Abre el siguiente módulo si ya pasó todos los 20 niveles del actual
export function tryUnlockNextModule(data, moduleKey) {
  const MODULE_ORDER = [
    'm1_multiplicacion',
    'm2_division',
    'm3_fracciones_intro',
    'm4_fracciones_ops',
  ];
  const idx = MODULE_ORDER.indexOf(moduleKey);
  if (idx === -1 || idx === MODULE_ORDER.length - 1) return data;

  // Hay que tener los 20 niveles del módulo superados
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

// Crea un archivo descargable con el progreso para hacer copia de seguridad
export function buildExportLink(data) {
  const json = JSON.stringify(data, null, 2);
  const uri = `data:text/json;charset=utf-8,${encodeURIComponent(json)}`;
  const anchor = document.createElement('a');
  anchor.href = uri;
  anchor.download = 'progreso_eduaventura.json';
  return anchor;
}

// Restaura la partida desde un archivo que el usuario suba
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

// Revisa que los datos cargados tengan todos los campos y no falte nada nuevo
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
  data.user.unlocked_titles = data.user.unlocked_titles.map((t) =>
    typeof t === 'string' && t.includes('Laureano') ? '🌟 Leyenda de 4.° Grado' : t
  );
  data.user.title = data.user.title || 'Novato Matemático';
  if (typeof data.user.title === 'string' && data.user.title.includes('Laureano')) {
    data.user.title = '🌟 Leyenda de 4.° Grado';
  }
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

  // Sumar todas las estrellas ganadas para tener el total al día
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
