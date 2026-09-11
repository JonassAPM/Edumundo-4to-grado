/**
 * @file matching_canvas.js — Motor de Trazado de Líneas (Canvas Matching)
 *
 * SPEC Referencias:
 *   Parámetro 54  — Tipología 4: Unión mediante Trazado de Líneas.
 *   Parámetro 115 — Composición: columna izquierda (nodos), centro (canvas), derecha (nodos).
 *   Parámetro 140 — Trazado continuo: línea sigue el dedo, verde si conecta correctamente.
 *   Parámetro 23  — Control de fugas de memoria: clearRect() en cada frame.
 *   Parámetro 13  — Destrucción explícita de event listeners al desmontar.
 *
 * NOTA: Implementación completa en fase de motor de juego.
 */

'use strict';

/**
 * Inicializa el canvas de matching.
 *
 * @param {HTMLCanvasElement} canvas - Elemento canvas central.
 * @param {HTMLElement[]}     leftNodes  - Nodos de la columna izquierda.
 * @param {HTMLElement[]}     rightNodes - Nodos de la columna derecha.
 * @param {Array<[number,number]>} correctPairs - Pares correctos [indexLeft, indexRight].
 * @param {Function} onComplete - Callback cuando todos los pares están conectados.
 * @returns {{ destroy: Function, reset: Function }}
 */
export function initMatchingCanvas(canvas, leftNodes, rightNodes, correctPairs, onComplete) {
  // TODO: Implementación en fase de motor de juego.
  console.log('[MatchingCanvas] initMatchingCanvas — pendiente de implementación.');
  return {
    destroy() {},
    reset() {},
  };
}
