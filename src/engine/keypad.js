/**
 * @file keypad.js — Teclado Numérico Virtual
 *
 * SPEC Referencias:
 *   Parámetro 53  — Tipología 3: Relleno de Casillas con Teclado en Pantalla.
 *   Parámetro 116 — Diseño: matriz 3×4 con ⌫ y OK.
 *   Parámetro 92  — Revisión en tiempo real con cursor parpadeante.
 *   Parámetro 93  — Tecla ⌫ (retroceso cifra) y C (limpiar casilla).
 *   Parámetro 154 — Casilla activa con borde azul cian parpadeante.
 *   Parámetro 13  — Destrucción de listeners al desmontar.
 *
 * NOTA: Implementación completa en fase de motor de juego.
 */

'use strict';

/**
 * Monta el teclado numérico dentro del contenedor dado.
 *
 * @param {HTMLElement} container - Donde se renderizará el keypad.
 * @param {Function}    onInput   - Callback(value: string) al pulsar una tecla.
 * @returns {{ destroy: Function, focusCell: Function }}
 */
export function mountKeypad(container, onInput) {
  // TODO: Implementación en fase de motor de juego.
  console.log('[Keypad] mountKeypad — pendiente de implementación.');
  return {
    destroy() {},
    focusCell(_cellId) {},
  };
}
