/**
 * @file curriculum_m3.js — Datos Curriculares: Módulo 3 – Fracciones (Noción)
 *
 * SPEC Referencias:
 *   Parámetro 15  — Desacoplamiento Datos-Motor.
 *   Parámetro 30  — Fracciones: parte-todo, numerador, denominador, figuras geométricas.
 *   Parámetro 41  — Enfoque CPA: primero lo visual (tortas/frutas), luego el símbolo a/b.
 *   Parámetro 45  — Progresión: desde mitades hasta fracciones impropias 7/4.
 *   Parámetro 197 — Propiedad 'dba'.
 *
 * NOTA: Los 15 niveles se poblarán en la fase de contenidos.
 */

'use strict';

/** @type {import('./curriculum_m1.js').LevelConfig[]} */
export const M3_LEVELS = [
  {
    id: 1,
    type: 'fraction_shape',   // Tipología de fracción gráfica (Parámetro 55)
    phase: 'acquisition',
    dba: 'DBA #5 G4 — Identificar fracciones como parte de un entero.',
    title: 'Mitades y cuartos',
    generateExercise(seed = Date.now()) {
      const rng = _seededRng(seed);
      const denominators = [2, 4];
      const den = denominators[Math.floor(rng() * denominators.length)];
      const num = _randInt(rng, 1, den - 1);
      return {
        numerator: num, denominator: den,
        shape: 'circle',
        context: `Colorea ${num} de cada ${den} partes de la torta.`,
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
