/**
 * @file curriculum_m4.js — Datos Curriculares: Módulo 4 – Fracciones (Operaciones)
 *
 * SPEC Referencias:
 *   Parámetro 15  — Desacoplamiento Datos-Motor.
 *   Parámetro 31  — Fracciones homogéneas, adición/sustracción denominadores iguales.
 *   Parámetro 46  — Progresión: desde 1/2=2/4 hasta 3/8+2/8=5/8.
 *   Parámetro 94  — Validación de fracciones equivalentes.
 *   Parámetro 97  — Mensaje pedagógico al sumar denominadores en vez de mantenerlos.
 *   Parámetro 197 — Propiedad 'dba'.
 *
 * NOTA: Los 15 niveles se poblarán en la fase de contenidos.
 */

'use strict';

/** @type {import('./curriculum_m1.js').LevelConfig[]} */
export const M4_LEVELS = [
  {
    id: 1,
    type: 'drag_drop',
    phase: 'acquisition',
    dba: 'DBA #6 G4 — Sumar y restar fracciones con el mismo denominador.',
    title: 'Fracciones equivalentes gráficas',
    generateExercise(seed = Date.now()) {
      const rng = _seededRng(seed);
      const pairs = [[1, 2, 2, 4], [1, 3, 2, 6], [2, 4, 1, 2]];
      const [n1, d1, n2, d2] = pairs[Math.floor(rng() * pairs.length)];
      return {
        fraction1: { n: n1, d: d1 },
        fraction2: { n: n2, d: d2 },
        areEquivalent: true,
        context: `¿Son iguales ${n1}/${d1} y ${n2}/${d2}?`,
      };
    },
  },
  // Niveles 2–15 se completarán en la fase de contenidos.
];

function _seededRng(seed) {
  let s = seed >>> 0;
  return () => { s += 0x6d2b79f5; let t = s; t = Math.imul(t ^ (t >>> 15), 1 | t); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function _randInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
