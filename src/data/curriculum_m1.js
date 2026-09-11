/**
 * @file curriculum_m1.js — Datos Curriculares: Módulo 1 – Multiplicación
 *
 * SPEC Referencias:
 *   Parámetro 15  — Desacoplamiento Datos-Motor: toda la información de niveles
 *                   reside aquí, separada de la lógica de renderizado.
 *   Parámetro 28  — Módulo 1: Multiplicación Avanzada y Propiedades.
 *   Parámetros 33–36 — Fases: Adquisición (1-4), Práctica (5-9),
 *                       Resolución (10-14), Maestro (15).
 *   Parámetro 39  — Generación determinista con rangos controlados.
 *   Parámetro 40  — Contextualización agrícola y cotidiana (Aguachica, Cesar).
 *   Parámetro 197 — Propiedad 'dba' con referencia al DBA de Matemáticas G4.
 *
 * NOTA: Los 15 niveles se poblarán completamente en la fase de contenidos.
 *       Este stub define la estructura y los primeros 2 niveles de ejemplo.
 */

'use strict';

/**
 * @typedef {Object} LevelConfig
 * @property {number}   id           - Número de nivel (1–15).
 * @property {string}   type         - Tipología de ejercicio.
 * @property {string}   phase        - 'acquisition'|'practice'|'problem'|'master'.
 * @property {string}   dba          - Derecho Básico de Aprendizaje referenciado.
 * @property {string}   title        - Título descriptivo del nivel.
 * @property {Function} generateExercise - Genera los datos del ejercicio (determinista por seed).
 */

/** @type {LevelConfig[]} */
export const M1_LEVELS = [
  // ── Fase de Adquisición: Niveles 1–4 ──────────────────────────────────────
  {
    id: 1,
    type: 'fill_keypad',
    phase: 'acquisition',
    dba: 'DBA #3 G4 — Reconocer y usar las tablas de multiplicar en cálculos.',
    title: 'Tablas del 1 al 5',
    /**
     * Genera un ejercicio de multiplicación sencilla (tablas 1–5).
     * @param {number} [seed=Date.now()]
     * @returns {{ a: number, b: number, answer: number, context: string }}
     */
    generateExercise(seed = Date.now()) {
      const rng = _seededRng(seed);
      const a = _randInt(rng, 1, 5);
      const b = _randInt(rng, 1, 9);
      return {
        a, b,
        answer: a * b,
        context: `En la finca hay ${a} surcos con ${b} matas de yuca cada uno. ¿Cuántas matas hay en total?`,
      };
    },
  },
  {
    id: 2,
    type: 'multiple_choice',
    phase: 'acquisition',
    dba: 'DBA #3 G4 — Reconocer y usar las tablas de multiplicar en cálculos.',
    title: 'Tablas del 6 al 9',
    generateExercise(seed = Date.now()) {
      const rng = _seededRng(seed);
      const a = _randInt(rng, 6, 9);
      const b = _randInt(rng, 2, 9);
      const answer = a * b;
      const distractors = _generateDistractors(rng, answer, 3);
      return { a, b, answer, options: _shuffle(rng, [answer, ...distractors]) };
    },
  },
  // Niveles 3–15 se completarán en la fase de contenidos.
];

// ─── Utilidades de generación determinista ─────────────────────────────────────

/**
 * Generador de números pseudoaleatorios con semilla (Mulberry32).
 * Garantiza reproducibilidad si se pasa la misma semilla (Parámetro 39).
 *
 * @param {number} seed
 * @returns {() => number} Función que retorna float en [0, 1).
 */
function _seededRng(seed) {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Genera un entero aleatorio en [min, max] usando la función RNG.
 * @param {() => number} rng
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function _randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Genera distractores pedagógicamente calculados para selección múltiple.
 * @param {() => number} rng
 * @param {number} correct
 * @param {number} count
 * @returns {number[]}
 */
function _generateDistractors(rng, correct, count) {
  const set = new Set();
  const offsets = [-2, -1, 1, 2, 5, 10, -5];
  for (const offset of offsets) {
    const val = correct + offset;
    if (val > 0 && val !== correct) set.add(val);
    if (set.size >= count) break;
  }
  while (set.size < count) {
    set.add(_randInt(rng, Math.max(1, correct - 15), correct + 15));
  }
  return [...set].slice(0, count);
}

/**
 * Fisher-Yates shuffle con RNG determinista.
 * @param {() => number} rng
 * @param {any[]} arr
 * @returns {any[]}
 */
function _shuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
