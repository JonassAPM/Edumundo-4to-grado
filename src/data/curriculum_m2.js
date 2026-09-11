/**
 * @file curriculum_m2.js — Datos Curriculares: Módulo 2 – División
 *
 * SPEC Referencias:
 *   Parámetro 15  — Desacoplamiento Datos-Motor.
 *   Parámetro 29  — División Formal y Algorítmica.
 *   Parámetro 44  — Progresión: desde 48÷6 hasta 754÷12 con residuo.
 *   Parámetro 197 — Propiedad 'dba' referenciando DBA de Matemáticas G4.
 *
 * NOTA: Los 15 niveles se poblarán en la fase de contenidos.
 */

'use strict';

/** @type {import('./curriculum_m1.js').LevelConfig[]} */
export const M2_LEVELS = [
  {
    id: 1,
    type: 'fill_keypad',
    phase: 'acquisition',
    dba: 'DBA #4 G4 — Efectuar divisiones con divisor de una cifra.',
    title: 'Repartos exactos simples',
    generateExercise(seed = Date.now()) {
      const rng = _seededRng(seed);
      const b = _randInt(rng, 2, 6);
      const q = _randInt(rng, 2, 9);
      const a = b * q;
      return {
        dividend: a, divisor: b,
        quotient: q, remainder: 0,
        context: `Se repartieron ${a} mangos en bolsas de ${b}. ¿Cuántas bolsas completas hay?`,
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
