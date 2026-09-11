/**
 * @file level_board.js — Tablero de Niveles del Módulo
 *
 * SPEC Referencias:
 *   Parámetro 110 — Cuadrícula 5×3 con 15 botones numerados y estrellas.
 *   Parámetro 111 — Diferenciación visual: pergamino (guías), cofre dorado (maestro).
 *   Parámetro 164 — Pantalla 3: niveles bloqueados, activos y superados.
 *   Parámetro 60  — Desbloqueo lineal: N+1 bloqueado hasta que N tiene cleared: true.
 *
 * NOTA: Implementación completa en fase de UI.
 */

'use strict';

/**
 * Renderiza el tablero de niveles de un módulo.
 *
 * @param {HTMLElement}                         container  - Donde se monta.
 * @param {string}                              moduleKey  - Clave del módulo activo.
 * @param {import('../core/storage.js').SaveData} saveData  - Datos de progreso.
 * @param {Function} onLevelSelect - Callback(levelNum: number) al tocar un nivel.
 * @param {Function} onBack        - Callback() al presionar Atrás.
 * @returns {{ destroy: Function }}
 */
export function mountLevelBoard(container, moduleKey, saveData, onLevelSelect, onBack) {
  // TODO: Implementación en fase de UI.
  console.log('[LevelBoard] mountLevelBoard — pendiente de implementación.');
  return { destroy() {} };
}
