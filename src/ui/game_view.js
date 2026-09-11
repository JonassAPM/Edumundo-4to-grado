/**
 * @file game_view.js — Vista de Juego Activo (Gameplay)
 *
 * SPEC Referencias:
 *   Parámetro 106 — Estructura en 3 bandas: HUD (15%), tablero (70%), controles (15%).
 *   Parámetro 107 — HUD Superior: sonido, salir, logo, monedas, estrellas, pausa.
 *   Parámetro 112 — Pantalla de Multiplicación: avatar (40%) + tablero (60%).
 *   Parámetro 113 — Pantalla de División.
 *   Parámetro 114 — Pantalla de Fracciones gráfica.
 *   Parámetro 115 — Pantalla de Parejas (Canvas Matching).
 *   Parámetro 166 — Pantalla 5: despliegue de actividad y botón Comprobar.
 *   Parámetro 65  — Botón de Comprobación Voluntaria.
 *   Parámetro 64  — Cronómetro solo estadístico (sin derrota por tiempo).
 *   Parámetro 67  — Debounce de 300ms en botones.
 *
 * NOTA: Implementación completa en fase de UI.
 */

'use strict';

/**
 * Monta la vista de juego activa.
 *
 * @param {HTMLElement}    container   - Contenedor raíz donde se monta.
 * @param {object}         levelConfig - Configuración del nivel (LevelConfig).
 * @param {object}         exercise    - Datos del ejercicio generado.
 * @param {Function}       onSubmit    - Callback({ userAnswer, time_sec }) al comprobar.
 * @param {Function}       onExit      - Callback() al presionar Salir/Atrás.
 * @returns {{ destroy: Function, showFeedback: Function }}
 */
export function mountGameView(container, levelConfig, exercise, onSubmit, onExit) {
  // TODO: Implementación en fase de UI.
  console.log('[GameView] mountGameView — pendiente de implementación.');
  return {
    destroy() {},
    showFeedback(_result) {},
  };
}
